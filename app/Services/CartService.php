<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

/**
 * One place for cart logic so guests (session cart) and logged-in
 * users (database cart) behave the same way.
 *
 * Every item is returned in the same shape:
 * [product_id, name, description, price, quantity, subtotal, image, stock]
 */
class CartService
{
    private const SESSION_KEY = 'cart';

    private const BUY_NOW_KEY = 'buy_now';

    /* ----------------------------------------------------------------- */
    /*  Reading                                                           */
    /* ----------------------------------------------------------------- */

    public function items(?User $user): array
    {
        if ($user) {
            return CartItem::with('product')
                ->where('cart_id', $this->dbCart($user)->id)
                ->get()
                ->filter(fn (CartItem $item) => $item->product !== null)
                ->map(fn (CartItem $item) => $this->formatItem($item->product, $item->quantity))
                ->values()
                ->all();
        }

        $items = [];
        foreach (session(self::SESSION_KEY, []) as $productId => $quantity) {
            if ($product = Product::find($productId)) {
                $items[] = $this->formatItem($product, (int) $quantity);
            }
        }

        return $items;
    }

    public function count(?User $user): int
    {
        if ($user) {
            return (int) Cart::where('user_id', $user->id)->value('num_items');
        }

        return count(session(self::SESSION_KEY, []));
    }

    public function summary(array $items, string $status = 'active'): array
    {
        $subtotal = round(array_sum(array_column($items, 'subtotal')), 2);
        $shipping = count($items) > 0 ? Order::SHIPPING_FEE : 0;

        return [
            'status' => $status,
            'subtotal' => $subtotal,
            'shipping_cost' => $shipping,
            'total_cost' => $subtotal + $shipping,
            'num_items' => count($items),
        ];
    }

    /* ----------------------------------------------------------------- */
    /*  Writing                                                           */
    /* ----------------------------------------------------------------- */

    /**
     * Add a quantity of a product. Returns the quantity actually in the cart
     * afterwards (capped at available stock).
     */
    public function add(?User $user, Product $product, int $quantity): int
    {
        $current = $this->quantityOf($user, $product->id);

        return $this->setQuantity($user, $product, $current + $quantity);
    }

    public function setQuantity(?User $user, Product $product, int $quantity): int
    {
        $quantity = max(1, min($quantity, $product->stock));

        if ($user) {
            $cart = $this->dbCart($user);
            CartItem::updateOrCreate(
                ['cart_id' => $cart->id, 'product_id' => $product->id],
                [
                    'user_id' => $user->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                    'subtotal' => $quantity * $product->price,
                    'stock' => $product->stock,
                    'image' => $product->image,
                    'name' => $product->name,
                    'description' => $product->description,
                ]
            );
            $cart->recalculateTotals();
        } else {
            $cart = session(self::SESSION_KEY, []);
            $cart[$product->id] = $quantity;
            session([self::SESSION_KEY => $cart]);
        }

        return $quantity;
    }

    public function remove(?User $user, string $productId): void
    {
        if ($user) {
            $cart = $this->dbCart($user);
            CartItem::where('cart_id', $cart->id)->where('product_id', $productId)->delete();
            $cart->recalculateTotals();

            return;
        }

        $cart = session(self::SESSION_KEY, []);
        unset($cart[$productId]);
        session([self::SESSION_KEY => $cart]);
    }

    public function clear(?User $user): void
    {
        if ($user) {
            $cart = $this->dbCart($user);
            CartItem::where('cart_id', $cart->id)->delete();
            $cart->recalculateTotals();

            return;
        }

        session()->forget(self::SESSION_KEY);
    }

    /** Drop the guest (session) cart, e.g. on login, so an account only shows its own saved cart. */
    public function discardSessionCart(): void
    {
        session()->forget([self::SESSION_KEY, self::BUY_NOW_KEY]);
    }

    /**
     * Move a guest's session cart into a brand-new account (used on registration).
     */
    public function mergeSessionIntoUser(User $user): void
    {
        $sessionCart = session(self::SESSION_KEY, []);

        foreach ($sessionCart as $productId => $quantity) {
            if ($product = Product::find($productId)) {
                if ($product->stock > 0) {
                    $this->add($user, $product, (int) $quantity);
                }
            }
        }

        session()->forget(self::SESSION_KEY);
    }

    /* ----------------------------------------------------------------- */
    /*  Buy now                                                           */
    /* ----------------------------------------------------------------- */

    public function setBuyNow(Product $product, int $quantity): void
    {
        session([self::BUY_NOW_KEY => ['product_id' => $product->id, 'quantity' => $quantity]]);
    }

    public function forgetBuyNow(): void
    {
        session()->forget(self::BUY_NOW_KEY);
    }

    /**
     * Items for checkout. Prices always come from the products table,
     * never from the browser.
     */
    public function checkoutItems(User $user, string $mode): array
    {
        if ($mode === 'buy_now') {
            $buyNow = session(self::BUY_NOW_KEY);
            $product = $buyNow ? Product::find($buyNow['product_id']) : null;

            return $product ? [$this->formatItem($product, (int) $buyNow['quantity'])] : [];
        }

        return $this->items($user);
    }

    /* ----------------------------------------------------------------- */
    /*  Helpers                                                           */
    /* ----------------------------------------------------------------- */

    public function dbCart(User $user): Cart
    {
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    private function quantityOf(?User $user, string $productId): int
    {
        if ($user) {
            return (int) CartItem::where('cart_id', $this->dbCart($user)->id)
                ->where('product_id', $productId)
                ->value('quantity');
        }

        return (int) (session(self::SESSION_KEY, [])[$productId] ?? 0);
    }

    private function formatItem(Product $product, int $quantity): array
    {
        return [
            'product_id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'quantity' => $quantity,
            'subtotal' => round($quantity * $product->price, 2),
            'image' => $product->image,
            'stock' => $product->stock,
        ];
    }
}
