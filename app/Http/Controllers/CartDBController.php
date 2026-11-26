<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartDBController extends Controller
{
    public function __construct(private CartService $carts) {}

    public function index(Request $request)
    {
        $items = $this->carts->items($request->user());

        return Inertia::render('Cart/Index', [
            'cart' => $this->carts->summary($items),
            'cartItems' => $items,
        ]);
    }

    public function addToCart(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'string', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($data['product_id']);

        if ($product->stock < 1) {
            return back()->with('error', "{$product->name} is out of stock.");
        }

        $this->carts->add($request->user(), $product, (int) ($data['quantity'] ?? 1));

        return back()->with('success', 'Product added to cart!');
    }

    public function updateCart(Request $request, string $productId)
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($productId);
        $this->carts->setQuantity($request->user(), $product, (int) $data['quantity']);

        return back()->with('success', 'Cart updated.');
    }

    public function removeFromCart(Request $request, string $productId)
    {
        $this->carts->remove($request->user(), $productId);

        return back()->with('success', 'Item removed from cart.');
    }

    public function clearCart(Request $request)
    {
        $this->carts->clear($request->user());

        return redirect()->route('cart')->with('success', 'Cart cleared.');
    }

    public function buyNow(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'string', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($data['product_id']);
        $quantity = (int) ($data['quantity'] ?? 1);

        if ($quantity > $product->stock) {
            return back()->with('error', "Only {$product->stock} of {$product->name} left in stock.");
        }

        $this->carts->setBuyNow($product, $quantity);

        return redirect()->route('checkout', ['mode' => 'buy_now']);
    }

    public function checkout(Request $request)
    {
        $mode = $request->query('mode') === 'buy_now' ? 'buy_now' : 'cart';
        $items = $this->carts->checkoutItems($request->user(), $mode);

        if (empty($items)) {
            return redirect()->route('cart')->with('error', 'Your cart is empty. Add items before checking out.');
        }

        return Inertia::render('Orders/Create', [
            'cart' => $this->carts->summary($items, $mode),
            'cartItems' => $items,
        ]);
    }
}
