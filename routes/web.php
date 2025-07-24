<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\AdminMiddleware;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $products = Product::all();
    return Inertia::render('guest', [
            'products' => $products
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard')->middleware(AdminMiddleware::class);



    // Route::get('/shop', [ShopController::class, 'index'])
    // //     ->name('shop.index');
    // Route::get('/shop/{id}', [ShopController::class, 'show'])
    //     ->name('shop.show');
    // Route::get('/shop/filter', [ShopController::class, 'filterbyCategory'])
    //     ->name('shop.filter');

});

Route::get('/shop', [ShopController::class, 'index'])
    ->name('shop.index');

Route::get('/shop/{id}', [ShopController::class, 'show'])
    ->name('shop.show');

Route::post('/shop/filter/category', [ShopController::class, 'filterbyCategory'])->name('shop.filter.category');
Route::post('/shop/filter/collection', [ShopController::class, 'filterbyCollection'])->name('shop.filter.collection');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/productcontroller.php';
require __DIR__.'/ordercontroller.php';
require __DIR__.'/cartcontroller.php';
require __DIR__.'/sessionCartcontroller.php';
require __DIR__.'/adminProductController.php';
require __DIR__.'/adminOrderController.php';
require __DIR__.'/guestcontroller.php';
