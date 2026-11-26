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

test('logging in shows only the saved account cart, not the guest cart', function () {
    $saved = makeProduct(['name' => 'Saved Tee']);
    $guestPick = makeProduct(['name' => 'Guest Tee']);
    $user = User::factory()->create();
    app(\App\Services\CartService::class)->add($user, $saved, 1);

    $this->post('/cart/add', ['product_id' => $guestPick->id, 'quantity' => 2])->assertSessionHasNoErrors();
    $this->post('/login', ['email' => $user->email, 'password' => 'password']);

    expect($user->cartItems()->pluck('product_id')->all())->toBe([$saved->id]);
    $this->get('/cart')->assertInertia(fn ($page) => $page->has('cartItems', 1)->where('cartItems.0.name', 'Saved Tee'));
});

test('a guest cart becomes the cart of a newly registered account', function () {
    $product = makeProduct();

    $this->post('/cart/add', ['product_id' => $product->id, 'quantity' => 2]);
    $this->post('/register', [
        'name' => 'New Fan',
        'email' => 'newfan@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::where('email', 'newfan@example.com')->first();
    expect($user->cartItems()->first()->quantity)->toBe(2);
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

test('product seeder names products and attaches photos from the band folders', function () {
    $photo = public_path('images/products/wknd/wknd_hoodie.png');
    $existed = is_file($photo);
    if (! $existed) {
        copy(public_path(\Database\Seeders\ProductSeeder::PLACEHOLDER), $photo);
    }

    try {
        $this->seed(\Database\Seeders\ProductSeeder::class);

        expect(Product::count())->toBe(16);
        $hoodie = Product::where('collection', 'wknd')->where('category', 'hoodies')->first();
        expect($hoodie->name)->toBe('The Weeknd Pullover Hoodie')
            ->and($hoodie->image)->toStartWith('images/products/wknd/wknd_hoodie.'); // real photo or the test's copy

        // Admin uploads are left alone on re-seed.
        $hoodie->update(['image' => 'uploads/custom.png']);
        $this->seed(\Database\Seeders\ProductSeeder::class);
        expect($hoodie->fresh()->image)->toBe('uploads/custom.png')
            ->and(Product::count())->toBe(16);
    } finally {
        if (! $existed) {
            @unlink($photo);
        }
    }
});

test('buying an item with buy now also takes it out of the cart', function () {
    $hoodie = makeProduct(['name' => 'Hoodie', 'stock' => 10]);
    $tee = makeProduct(['name' => 'Tee', 'stock' => 10]);
    $user = User::factory()->create();

    $this->actingAs($user)->post('/cart/add', ['product_id' => $hoodie->id, 'quantity' => 1]);
    $this->actingAs($user)->post('/cart/add', ['product_id' => $tee->id, 'quantity' => 1]);

    $this->actingAs($user)->post('/buy-now', ['product_id' => $hoodie->id, 'quantity' => 1]);
    $this->actingAs($user)->post('/orders', [
        'receiver_name' => 'Juan Dela Cruz',
        'receiver_address' => '123 Street, Manila',
        'phone' => '09171234567',
        'mode' => 'buy_now',
    ])->assertRedirect();

    // The hoodie was bought, so it leaves the cart; the tee stays.
    expect($user->cartItems()->pluck('product_id')->all())->toBe([$tee->id])
        ->and($hoodie->fresh()->stock)->toBe(9);
});
