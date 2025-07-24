<?php

use App\Http\Controllers\CartDBController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public (accessible to guests & users)
Route::get('/cart', [CartDBController::class, 'index'])->name('cart');
Route::get('/cart/get', [CartDBController::class, 'getCartItems'])->name('cartItems');
Route::post('/cart/add', [CartDBController::class, 'addToCart'])->name('cart.add');
Route::put('/cart/update/{itemId}', [CartDBController::class, 'updateCart'])->name('cart.update');
Route::post('/cart/remove/{productId}', [CartDBController::class, 'removeFromCart']);
Route::put('/cart/clear', [CartDBController::class, 'clearCart'])->name('cart.clear');
Route::post('/buy-now', [CartDBController::class, 'buyNow'])->name('buy.now');
Route::get('/checkout', [CartDBController::class, 'checkout'])->name('checkout');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
