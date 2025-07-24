<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartDBController extends Controller
{
    public function index()
    {
        if (Auth::check()) {
            $sessionCart = session()->get('cart', []);
            $this->mergeSessionCartToDb($sessionCart);
            $user = Auth::user();
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);
            $cartItems = CartItem::where('cart_id', $cart->id)->with('product')->get();

            return Inertia::render('Cart/Index', [
                'cart' => $cart,
                'cartItems' => $cartItems,
            ]);
        }

        // Guest session cart
        $sessionCart = session()->get('cart', []);
        $subtotal = collect($sessionCart)->sum('subtotal');

        $cart = (object)[
            'subtotal' => $subtotal,
            'shipping_cost' => 100,
            'total_cost' => $subtotal + 100,
            'num_items' => count($sessionCart),
            'status' => 'guest',
        ];

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
            'cartItems' => array_values($sessionCart), // make sure it’s an indexed array
        ]);
    }

   public function mergeSessionCartToDb($cart)
    {
        $sessionCart = session()->get('cart', []);
        $cart = Cart::where('user_id', Auth::id())->first();
        foreach ($sessionCart as $item) {
            // dd($item);
            $productId = $item['id'];
            $quantity = $item['quantity'];

            $product = Product::find($productId);
            if (!$product) {
                continue; // skip invalid
            }

            $cart_id = Cart::where('user_id', Auth::id())->first()->id;

            $cartItem = CartItem::where('cart_id', $cart_id)
                ->where('product_id', $productId)
                ->first();

            if ($cartItem) {
                // Update existing item
                $cartItem->quantity += $quantity;
                $cartItem->subtotal = $cartItem->quantity * $product->price;
                $cartItem->save();
            } else {
                // Create new item
                CartItem::create([
                    'cart_id' => $cart->id,
                    'user_id' => Auth::id(),
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'price' => $product->price,
                    'subtotal' => $quantity * $product->price,
                    'stock' => $product->stock,
                    'image' => $product->image,
                    'name' => $product->name,
                    'description' => $product->description,
                ]);
            }
        }

        $cart->recalculateTotals();

        // Clear session cart
        session()->forget('cart');
    }

   public function addToCart(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);

        $product = Product::findOrFail($productId);

        if (Auth::check()) {
            // DB cart
            $user = $request->user();
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);

            $cartItem = CartItem::updateOrCreate(
                ['product_id' => $productId, 'cart_id' => $cart->id],
                [
                    'user_id' => $user->id,
                    'quantity' => $quantity,
                    'subtotal' => $quantity * $product->price,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'image' => $product->image,
                    'name' => $product->name,
                    'description' => $product->description,
                ]
            );

            $cart->recalculateTotals();

            return redirect()->back()->with('success', 'Product added to cart successfully!');
        }

        // Session guest cart
        $sessionCart = session()->get('cart', []);

        $key = array_search($productId, array_column($sessionCart, 'product_id'));

        if ($key !== false) {
            $sessionCart[$key]['quantity'] += $quantity;
            $sessionCart[$key]['subtotal'] = $sessionCart[$key]['quantity'] * $product->price;
        } else {
            $sessionCart[] = [
                'product_id' => $productId,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'quantity' => $quantity,
                'subtotal' => $quantity * $product->price,
                'image' => $product->image,
            ];
        }

        session()->put('cart', $sessionCart);

        return redirect()->back()->with('success', 'Product added to cart!');
    }

    public function updateCart(Request $request, $itemId)
    {
        $productId = $itemId;
        $quantity = $request->input('quantity');

        $product = Product::findOrFail($productId);

        if (Auth::check()) {
            $user = Auth::user();
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);

            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $productId)
                ->first();

            if ($cartItem) {
                $cartItem->quantity = $quantity;
                $cartItem->subtotal = $quantity * $product->price;
                $cartItem->save();
            }

            $cart->recalculateTotals();
        } else {
            $sessionCart = session()->get('cart', []);

            foreach ($sessionCart as &$item) {
                if ($item['product_id'] == $productId) {
                    $item['quantity'] = $quantity;
                    $item['subtotal'] = $quantity * $product->price;
                }
            }

            session()->put('cart', $sessionCart);
        }

        return redirect()->back()->with('success', 'Cart updated successfully!');
    }


    public function removeFromCart(Request $request, $productId)
    {
        $product_id = $productId;
        // dd($product_id,$productId,$request);
        if (Auth::check()) {
            // dd($productId);
            $user = Auth::user();
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);

            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $productId)
                ->first();

            if ($cartItem) {
                $cartItem->delete();
            }

            $cart->recalculateTotals();
        } else {
            $sessionCart = session()->get('cart', []);
                // dd($product_id,$request);

            foreach ($sessionCart as &$item) {

                if ($item['id'] == $product_id) {
                    unset($item[$productId]);
                }
            }

            session()->put('cart', $sessionCart);

        }

        return redirect()->back()->with('success', 'Item removed from cart.');
    }




    public function clearCart(Request $request)
    {
        if (Auth::check()) {
            $user = $request->user();
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);

            CartItem::where('cart_id', $cart->id)->delete();
            $cart->recalculateTotals();
            $cart->num_items = 0;
            $cart->save();
        } else {
            session()->forget('cart');
        }

        return redirect()->route('cart')->with('success', 'Cart cleared successfully!');
    }



    public function checkout()
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('success', 'Please log in to use Checkout.');
        }
        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $cartItems = CartItem::where('cart_id', $cart->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart')->with('error', 'Your cart is empty. Please add items before checking out.');
        }

        return Inertia::render('Orders/Create', [
            'cart' => $cart,
            'cartItems' => $cartItems,
        ]);
    }

      public function buyNow(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('success', 'Please log in to use Buy Now.');
        }

        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);

        $product = Product::findOrFail($productId);

        if ($quantity < 1 || $quantity > $product->stock) {
            return redirect()->back()->with('error', 'Invalid quantity selected.');
        }

        $buyNowItem = [
            'product_id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'quantity' => $quantity,
            'subtotal' => $product->price * $quantity,
            'image' => $product->image,
            'stock' => $product->stock,
        ];

        $total = $buyNowItem['subtotal'];
        $shipping = 100;
        $total_cost = $total + $shipping;

        $cart->status = 'buy_now';
        $cart->save();

        return Inertia::render('Orders/Create', [
            'cart' => [
                'subtotal' => $total,
                'shipping_cost' => $shipping,
                'total_cost' => $total_cost,
                'status' => 'buy_now',
                'num_items' => 1,
            ],
            'cartItems' => [$buyNowItem],
        ]);
    }

}
