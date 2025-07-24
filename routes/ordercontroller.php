<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/orders/showOrders', [OrderController::class, 'showOrders'])
        ->name('orders.showOrders');
    Route::get('/orders/create', [OrderController::class, 'create'])
        ->name('orders.create');
    Route::post('finalize', [OrderController::class, 'finalize'])
        ->name('orders.finalize');
    Route::put('/orders/{order}/complete', [OrderController::class, 'complete'])
        ->name('orders.complete');
    Route::get('/orders/payment/{orderId}', [OrderController::class, 'continuePayment'])->name('orders.payment');

    // Route::delete('/products/{product}/delete', [ProductController::class, 'destroy'])
    //     ->name('products.destroy');
    // Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
    //     ->name('products.edit');
    // Route::put('/products/{product}/update', [ProductController::class, 'update'])
    //     ->name('products.update');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
