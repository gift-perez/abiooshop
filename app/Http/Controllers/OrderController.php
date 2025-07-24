<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    //
    public function index(){

        $user = Auth::user();
        if(!$user->role === 'admin'){
            return redirect()->route('shop.index')->with('message', "Page requires admin access");
        }
        $orders = Order::all();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);

    }

    public function showOrders()
    {
        $userId = Auth::id();
        $orders = Order::where('user_id', $userId)->get();

        return Inertia::render('Orders/UserOrders', [
            'orders' => $orders
        ]);
    }

    public function create(){
        // return view('products.create');
        return Inertia::render('Orders/Create');
    }

    public static function generateOrderid(int $length = 20): string
    {
        $order_id = Str::random($length);//Generate random string
        $exists = Order::where('id', '=', $order_id)->first();
        if (isset($exists[0]->id)) {//id exists in orders table
            return self::generateOrderid();//Retry with another generated id
        }
        return $order_id;//Return the generated id as it does not exist in the DB
    }

public function finalize(Request $request)
{
    $userId = Auth::id();



    $name = $request->receiver_name;
    $address = $request->receiver_address;
    $phone = $request->phone;

    $cart = Cart::where('user_id', $userId)->firstOrFail();
    $cartStatus = $cart->status;

    $items = [];
    $subtotal = 0;

    if ($cartStatus === 'buy_now') {
        // Buy Now flow — receive items directly from frontend
        $items = $request->input('items', []);

        foreach ($items as &$item) {
            $product = Product::findOrFail($item['product_id']);
            if ($product->stock >= $item['quantity']) {
                $product->decrement('stock', $item['quantity']);
            } else {
                return redirect()->route('shop.index')->with('message', "Insufficient stock for product: {$product->name}. Only {$product->stock} available.");
                throw new \Exception("Insufficient stock for product: {$product->name}. Only {$product->stock} available.");
            }

            $item['subtotal'] = $item['quantity'] * $item['price'];
            $subtotal += $item['subtotal'];
        }

    } else {
        $cartItems = CartItem::where('cart_id', $cart->id)->get();

        foreach ($cartItems as $cartItem) {
            $product = Product::findOrFail($cartItem->product_id);
            if ($product->stock >= $cartItem->quantity) {
                $product->decrement('stock', $cartItem->quantity);
            } else {
                return redirect()->route('shop.index')->with('message', "Insufficient stock for product: {$product->name}. Only {$product->stock} available.");
                throw new \Exception("Insufficient stock for product: {$product->name}. Only {$product->stock} available.");
            }

            $subtotal += $cartItem->subtotal;

            $items[] = [
                'product_id' => $cartItem->product_id,
                'name' => $cartItem->name,
                'description' => $cartItem->description,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->price,
                'subtotal' => $cartItem->subtotal,
                'image' => $cartItem->image,
            ];

            // After order, clear DB cart items
            CartItem::where('cart_id', $cart->id)->delete();
            $cart->recalculateTotals();
        }



    }

    // Store items JSON
    $itemsJson = json_encode($items);

    // Create Order
    $order = new Order();
    $order->id = $this->generateOrderid();
    $order->name = $name;
    $order->address = $address;
    $order->phone = $phone;
    $order->user_id = $userId;
    $order->order_status = 'pending';
    $order->cart = $itemsJson;
    $order->subtotal = $subtotal;
    $order->total_cost = $subtotal + 100.00; // example shipping fee

    $order->save();

    $cart->delete();

    $cart->status = 'active';

    $cart->save();
    return Inertia::render('Orders/GcashPayment', [
        'orderId' => $order->id,
        'order' => [
            'id' => $order->id,
            'user_id' => $order->user_id,
            'order_status' => $order->order_status,
            'subtotal' => $order->subtotal,
            'shipping_cost' => 100,
            'total_cost' => $order->total_cost,
            // 'notes' => $order->notes,
            'address' => $order->address,
            'name' => $order->name,
            'phone' => $order->phone,
            'cart' => $order->cart,
        ],
    ]);
}


    public function approve(Request $request){
        $orderId = $request->id;
        $order = Order::findOrFail($orderId);
        $order->order_status = 'approved';
        $order->save();
        Inertia::share($order);

        return redirect()->back()->with('message', 'Order confirmed successfully!');
    }

    public function destroy(Request $request){
        $orderId = $request->id;
        $order = Order::findOrFail($orderId);
        $order->delete();
        Inertia::share($order);
        return redirect()->back()->with('message', 'Order deleted successfully!');
    }

    public function markAsDelivered (Request $request){
        $orderId = $request->id;
        $order = Order::findOrFail($orderId);
        $order->order_status = 'delivered';
        $order->save();
        Inertia::share($order);

        return redirect()->back()->with('message', 'Order was marked as delivered!');
    }

    public function complete (Request $request){
        $orderId = $request->id;
        $order = Order::findOrFail($orderId);
        $order->order_status = 'completed';
        $order->save();
        Inertia::share($order);

        return redirect()->back()->with('message', 'Order was marked as completed!');
    }


public function continuePayment(Request $request)
{
    $orderId = $request->id;
    $order = Order::findOrFail($orderId);

    $jsonCart = json_decode($order->cart, true);

    //reserve stock
    foreach ($jsonCart as $item){
        $product = Product::where('id', $item['product_id'])->first();
        // $before = $product->stock;
        // dd($product->stock, (int)$item['quantity']);
        if((int)$item['quantity'] > $product->stock){
            return redirect()->back()->with('message', 'Not enough stock');
        }else{
            $product->stock = $product->stock - $item['quantity'];
            $product->save();
        }
        // $product->stock = $before - $item['quantity'];
        // $product->save(

        // dd($product->name,$product->id, $before, $after);
    }
    return Inertia::render('Orders/GcashPayment', [
        'orderId' => $order->id,
        'order' => [
            'id' => $order->id,
            'user_id' => $order->user_id,
            'order_status' => $order->order_status,
            'subtotal' => $order->subtotal,
            'shipping_cost' => 100,
            'total_cost' => $order->total_cost,
            'address' => $order->address,
            'name' => $order->name,
            'phone' => $order->phone,
            'cart' => $order->cart,
        ],
    ]);
}


}
