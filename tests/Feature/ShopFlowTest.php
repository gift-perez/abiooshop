<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

function makeProduct(array $overrides = []): Product
{
    return Product::create(array_merge([
        'name' => 'Test Tee',
        'description' => 'A shirt',
        'price' => 500,
        'stock' => 5,
        'collection' => 'the1975',
        'category' => 'shirts',
        'image' => 'uploads/test.png',
    ], $overrides));
}

function makeAdmin(): User
{
    $admin = User::factory()->create();
    $admin->forceFill(['role' => 'admin'])->save();

    return $admin;
}

function placeOrder(User $user, Product $product, int $quantity = 2): Order
{
    test()->actingAs($user)->post('/cart/add', ['product_id' => $product->id, 'quantity' => $quantity]);
    test()->actingAs($user)->post('/orders', [
        'receiver_name' => 'Juan Dela Cruz',
        'receiver_address' => '123 Street, Manila',
        'phone' => '09171234567',
    ]);

    return Order::where('user_id', $user->id)->latest()->firstOrFail();
}

test('shop and product pages render', function () {
    $product = makeProduct();

    $this->get('/shop')->assertOk();
    $this->get("/shop/{$product->id}")->assertOk();
});

test('a guest cart is merged into the account on login', function () {
    $product = makeProduct();
    $user = User::factory()->create();

    $this->post('/cart/add', ['product_id' => $product->id, 'quantity' => 2])->assertSessionHasNoErrors();

    $this->post('/login', ['email' => $user->email, 'password' => 'password']);

    expect($user->cart->fresh()->num_items)->toBe(1)
        ->and($user->cartItems()->first()->quantity)->toBe(2);
});

test('placing an order reserves stock and uses database prices', function () {
    $product = makeProduct(['price' => 500, 'stock' => 5]);
    $user = User::factory()->create();

    $order = placeOrder($user, $product, 2);

    expect($order->order_status)->toBe('pending')
        ->and($order->subtotal)->toBe(1000.0)
        ->and($order->total_cost)->toBe(1000.0 + Order::SHIPPING_FEE)
        ->and($product->fresh()->stock)->toBe(3)
        ->and($user->cart->fresh()->num_items)->toBe(0);
});

test('the owner can complete the demo payment', function () {
    $user = User::factory()->create();
    $order = placeOrder($user, makeProduct());

    $this->actingAs($user)->get("/orders/{$order->id}/payment")->assertOk();
    $this->actingAs($user)->post("/orders/{$order->id}/payment", ['result' => 'paid']);

    expect($order->fresh()->order_status)->toBe('paid');
});

test('other users cannot see or pay someone else\'s order', function () {
    $order = placeOrder(User::factory()->create(), makeProduct());
    $intruder = User::factory()->create();

    $this->actingAs($intruder)->get("/orders/{$order->id}/payment")->assertNotFound();
    $this->actingAs($intruder)->post("/orders/{$order->id}/payment", ['result' => 'paid'])->assertNotFound();
    $this->actingAs($intruder)->put("/orders/{$order->id}/cancel")->assertNotFound();

    expect($order->fresh()->order_status)->toBe('pending');
});

test('cancelling an unpaid order restores stock', function () {
    $product = makeProduct(['stock' => 5]);
    $user = User::factory()->create();
    $order = placeOrder($user, $product, 2);

    $this->actingAs($user)->put("/orders/{$order->id}/cancel");

    expect($order->fresh()->order_status)->toBe('cancelled_user')
        ->and($product->fresh()->stock)->toBe(5);
});

test('you cannot order more than is in stock', function () {
    $product = makeProduct(['stock' => 1]);
    $user = User::factory()->create();

    // Adding to cart is capped at stock...
    $this->actingAs($user)->post('/cart/add', ['product_id' => $product->id, 'quantity' => 10]);
    expect($user->cartItems()->first()->quantity)->toBe(1);

    // ...and buy-now refuses outright.
    $this->actingAs($user)->post('/buy-now', ['product_id' => $product->id, 'quantity' => 10])
        ->assertSessionHas('error');
});

test('customers cannot reach admin pages', function () {
    $product = makeProduct();
    $this->actingAs(User::factory()->create());

    $this->get('/admin/products')->assertForbidden();
    $this->get('/admin/orders')->assertForbidden();
    $this->delete("/admin/products/{$product->id}")->assertForbidden();

    expect(Product::whereKey($product->id)->exists())->toBeTrue();
});

test('admins can manage products and deliver paid orders', function () {
    $admin = makeAdmin();
    $user = User::factory()->create();
    $order = placeOrder($user, makeProduct());
    $order->update(['order_status' => 'paid']);

    $this->actingAs($admin)->get('/admin/products')->assertOk();
    $this->actingAs($admin)->get('/admin/orders')->assertOk();
    $this->actingAs($admin)->put("/admin/orders/{$order->id}/deliver");

    expect($order->fresh()->order_status)->toBe('delivered');

    $this->actingAs($user)->put("/orders/{$order->id}/complete");
    expect($order->fresh()->order_status)->toBe('completed');
});

test('nobody can register as an admin', function () {
    $this->post('/register', [
        'name' => 'Sneaky',
        'email' => 'sneaky@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'admin',
    ]);

    expect(User::where('email', 'sneaky@example.com')->first()->isAdmin())->toBeFalse();
});
