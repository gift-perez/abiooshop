<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/products', [ProductController::class, 'index'])->name('products.index')->middleware(AdminMiddleware::class);
    Route::get('/products/create', [ProductController::class, 'create'])
        ->name('products.create')->middleware(AdminMiddleware::class);
    Route::post('/products', [ProductController::class, 'store'])
        ->name('products.store')->middleware(AdminMiddleware::class);
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
        ->name('products.edit')->middleware(AdminMiddleware::class);
    Route::put('/products/{product}', [ProductController::class, 'update'])
        ->name('products.update')->middleware(AdminMiddleware::class);
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])
        ->name('products.destroy')->middleware(AdminMiddleware  ::class);
});




