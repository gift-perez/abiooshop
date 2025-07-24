<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('/products', [ProductController::class, 'index'])
    //     ->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])
        ->name('products.create');
    Route::post('/products/store', [ProductController::class, 'store'])
        ->name('products.store');
    Route::delete('/products/{product}/delete', [ProductController::class, 'destroy'])
        ->name('products.destroy');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
        ->name('products.edit');
    Route::put('/products/{product}/update', [ProductController::class, 'update'])
        ->name('products.update');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
