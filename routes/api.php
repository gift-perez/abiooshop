<?php

use App\Http\Controllers\PaymentController;
use Faker\Provider\ar_EG\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



 Route::get('/hello', [PaymentController::class, 'hello']);

 Route::post('/payment/initiate', [PaymentController::class, 'initiate'])->name('payment.initiate');
 Route::post('/payment/callback', [PaymentController::class, 'handleCallback'])->name('payment.callback');

 Route::get('/payment/orders/{orderId}', [PaymentController::class, 'getOrderDetails']);
