<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CartDBController;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/cart', [CartController::class, 'index'])->name('sessionCart');
Route::get('/cart/session/get', [CartController::class, 'getCartItems'])->name('sessionCartItems');
Route::post('/cart/session/add', [CartController::class, 'addToCart'])->name('sessionCart.add');
Route::put('/cart/session/update/{itemId}', [CartController::class, 'updateCart'])->name('sessionCart.update');
// Route::get('/checkout', [CartController::class, 'checkout'])->name('checkout');
Route::post('/cart/session/remove/{productId}', [CartController::class, 'removeFromSessionCart']);
Route::put('/cart/session/clear', [CartController::class, 'clearCart'])->name('sessionCart.clear');
// Route::post('/buy-now', [CartController::class, 'buyNow'])->name('buy.now');





require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
