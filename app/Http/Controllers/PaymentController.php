<?php

namespace App\Http\Controllers;

use App\Events\PaymentStatusUpdated;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class PaymentController extends Controller
{
    //
 public function initiate(Request $request)
    {
    $orderId = $request->order_id;
    $order = Order::findOrFail($orderId);

    // Check if already initiated or paid
    if ($order->payment_initiated) {
        return response()->json(['message' => 'Payment already initiated.'], 400);
    }

    if ($order->order_status === 'paid') {
        return response()->json(['message' => 'Order already paid.'], 400);
    }

    // Verify details coming from frontend
    $expectedDetails = [
        'user_id' => $order->user_id,
        'order_status' => $order->order_status,
        'subtotal' => $order->subtotal,
        'shipping_cost' => 100, // example static value
        'total_cost' => $order->total_cost,
        'address' => $order->address,
        'name' => $order->name,
        'phone' => $order->phone,
        'cart' => $order->cart,
    ];

    // Compare each field
    foreach ($expectedDetails as $key => $value) {
        if ($request->has($key)) {
            if ($request->$key != $value) {
                return response()->json([
                    'message' => "Order verification failed on field: {$key}.",
                    'expected' => $value,
                    'received' => $request->$key,
                ], 400);
            }
        }
    }

    // Passed verification: mark payment initiated
    $order->payment_initiated = true;
    $order->save();

    return response()->json([
        'message' => 'Payment initiated successfully. Order details verified.',
        'order' => $order,
    ]);
    }


public function handleCallback(Request $request)
{
    $orderId = $request->input('id');
    $status = $request->input('order_status');

    $order = Order::where('id', $orderId)->first();

    // Verify details coming from postman
    $expectedDetails = [
        'user_id' => $order->user_id,
        'order_status' => 'payment_failed' || 'paid' ,
        'subtotal' => $order->subtotal,
        'shipping_cost' => 100,
        'total_cost' => $order->total_cost,
        'address' => $order->address,
        'name' => $order->name,
        'phone' => $order->phone,
        'cart' => $order->cart,
    ];

    // Compare each field
    foreach ($expectedDetails as $key => $value) {
        if ($request->has($key)) {
            if ($request->$key != $value) {
                return response()->json([
                    'message' => "Order verification failed on field: {$key}.",
                    'expected' => $value,
                    'received' => $request->$key,
                ], 400);
            }
        }
    }

    if (!$order) {
        return response()->json(['message' => 'Order not found.'], 404);
    }

    if (!$order->payment_initiated) {
        return response()->json(['message' => 'Payment not yet initiated, cannot complete.'], 400);
    }

    $order->order_status = $status;
    $order->save();

    if ($order->order_status === 'payment_failed') {
        $jsonCart = json_decode($order->cart, true);
            foreach ($jsonCart as $item){

                $product = Product::where('id', $item['product_id'])->first();
                $before = $product->stock;
                $product->stock = $product->stock + $item['quantity'];
                $after = $product->stock;

                $product->save();

                // dd($product->name,$product->id, $before, $after);
            }
    }

    broadcast(new PaymentStatusUpdated($order->id, $status, [
        'id' => $order->id,
        'user_id' => $order->user_id,
        'order_status' => $order->order_status,
        'subtotal' => $order->subtotal,
        'shipping_cost' => 100,
        'total_cost' => $order->total_cost,
        'address' => $order->address,
        'name' => $order->name,
        'phone' => $order->phone,
    ]));

    if($order->order_status === 'payment_failed'){
        $order->order_status = 'pending';
        $order->save();
    }

    $cart = Cart::where('user_id', $order->user_id)->first();
    if($cart->status !== 'buy-now'){
        $cart->delete();
        $cart->recalculateTotals();
        $cart->num_items = 0;
        $cart->save();
    }


    return response()->json(['message' => 'Callback processed!']);
}

public function getOrderDetails($orderId)
{
    $order = Order::findOrFail($orderId);

    return response()->json([
        'id' => $order->id,
        'user_id' => $order->user_id,
        'order_status' => $order->order_status,
        'subtotal' => $order->subtotal,
        'shipping_cost' => 100,
        'total_cost' => $order->total_cost,
        'address' => $order->address,
        'name' => $order->name,
        'phone' => $order->phone,
        'cart' => json_decode($order->cart, true),
        'payment_initiated' => $order->payment_initiated,
    ]);
}



}
