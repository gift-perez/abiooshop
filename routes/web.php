<?php

use App\Http\Controllers\CartDBController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Storefront (guests and customers)
|--------------------------------------------------------------------------
*/

Route::get('/', [ShopController::class, 'home'])->name('home');
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/{product}', [ShopController::class, 'show'])->name('shop.show');

// Cart works for guests (session) and logged-in users (database).
Route::get('/cart', [CartDBController::class, 'index'])->name('cart');
Route::post('/cart/add', [CartDBController::class, 'addToCart'])->name('cart.add');
Route::put('/cart/update/{productId}', [CartDBController::class, 'updateCart'])->name('cart.update');
Route::post('/cart/remove/{productId}', [CartDBController::class, 'removeFromCart'])->name('cart.remove');
Route::put('/cart/clear', [CartDBController::class, 'clearCart'])->name('cart.clear');

/*
|--------------------------------------------------------------------------
| Customer area
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    // Starter-kit auth screens redirect to "dashboard"; send each role to its home.
    Route::get('dashboard', function () {
        return auth()->user()->isAdmin()
            ? redirect()->route('products.index')
            : redirect()->route('home');
    })->name('dashboard');

    Route::post('/buy-now', [CartDBController::class, 'buyNow'])->name('buy.now');
    Route::get('/checkout', [CartDBController::class, 'checkout'])->name('checkout');

    Route::get('/my-orders', [OrderController::class, 'showOrders'])->name('orders.showOrders');
    Route::post('/orders', [OrderController::class, 'finalize'])->name('orders.finalize');
    Route::get('/orders/{order}/payment', [OrderController::class, 'payment'])->name('orders.payment');
    Route::post('/orders/{order}/payment', [OrderController::class, 'simulatePayment'])
        ->middleware('throttle:20,1')
        ->name('orders.pay');
    Route::put('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::put('/orders/{order}/complete', [OrderController::class, 'complete'])->name('orders.complete');
});

/*
|--------------------------------------------------------------------------
| Admin area
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', AdminMiddleware::class])->prefix('admin')->group(function () {
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::put('/orders/{order}/deliver', [OrderController::class, 'markAsDelivered'])->name('orders.deliver');
    Route::put('/orders/{order}/admin-cancel', [OrderController::class, 'adminCancel'])->name('orders.adminCancel');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
