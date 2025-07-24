<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', [ShopController::class, 'index'])
    ->name('shop.guest');




// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');

//     Route::get('/shop', [ShopController::class, 'index'])
//         ->name('shop.index');
//     Route::get('/shop/{id}', [ShopController::class, 'show'])
//         ->name('shop.show');
//     Route::get('/shop/filter', [ShopController::class, 'filterbyCategory'])
//         ->name('shop.filter');

// });



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/productcontroller.php';
require __DIR__.'/ordercontroller.php';
require __DIR__.'/cartcontroller.php';
require __DIR__.'/adminProductController.php';
require __DIR__.'/adminOrderController.php';
