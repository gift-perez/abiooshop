<?php

use App\Http\Controllers\OrderController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])
        ->name('orders.index')->middleware(AdminMiddleware::class);
    Route::put('/orders/{order}/approve', [OrderController::class, 'approve'])
        ->name('orders.approve')->middleware(AdminMiddleware::class);
    Route::put('/orders/{order}/destroy', [OrderController::class, 'destroy'])
        ->name('orders.destroy')->middleware(AdminMiddleware::class);
    Route::put('/orders/{order}/deliver', [OrderController::class, 'markAsDelivered'])
        ->name('orders.deliver')->middleware(AdminMiddleware::class);
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
