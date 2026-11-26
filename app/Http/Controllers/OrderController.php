<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

/**
 * Order lifecycle:
 *
 *   pending ──(customer pays, demo)──> paid ──(admin)──> delivered ──(customer)──> completed
 *      │                                 │
 *      └─(customer cancels)              └─(admin cancels)
 *         cancelled_user                    cancelled_admin
 *
 * Stock is reserved when the order is placed and returned when it is cancelled.
 */
class OrderController extends Controller
{
    public function __construct(private CartService $carts) {}

    /* ----------------------------------------------------------------- */
    /*  Customer                                                          */
    /* ----------------------------------------------------------------- */

    public function showOrders(Request $request)
    {
        return Inertia::render('Orders/UserOrders', [
            'orders' => $request->user()->orders()->latest()->get(),
        ]);
    }

    public function finalize(Request $request)
    {
        $data = $request->validate([
            'receiver_name' => ['required', 'string', 'max:255'],
            'receiver_address' => ['required', 'string', 'max:1000'],
            'phone' => ['required', 'string', 'regex:/^(\+63|0)9\d{9}$/'],
            'mode' => ['nullable', 'in:cart,buy_now'],
        ], [
            'phone.regex' => 'Enter a valid PH mobile number, e.g. 09171234567.',
        ]);

        $user = $request->user();
        $mode = $data['mode'] ?? 'cart';
        $items = $this->carts->checkoutItems($user, $mode);

        if (empty($items)) {
            return redirect()->route('cart')->with('error', 'Your cart is empty.');
        }

        $order = DB::transaction(function () use ($items, $data, $user) {
            $lines = [];

            foreach ($items as $item) {
                // Lock the row so two checkouts can't oversell the same stock.
                $product = Product::whereKey($item['product_id'])->lockForUpdate()->first();

                if (! $product || $product->stock < $item['quantity']) {
                    $available = $product?->stock ?? 0;
                    throw ValidationException::withMessages([
                        'stock' => "Not enough stock for {$item['name']} (only {$available} left).",
                    ]);
                }

                $product->decrement('stock', $item['quantity']);

                $lines[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => round($item['quantity'] * $product->price, 2),
                    'image' => $product->image,
                ];
            }

            $subtotal = round(array_sum(array_column($lines, 'subtotal')), 2);

            return Order::create([
                'user_id' => $user->id,
                'name' => $data['receiver_name'],
                'address' => $data['receiver_address'],
                'phone' => $data['phone'],
                'order_status' => 'pending',
                'cart' => $lines,
                'subtotal' => $subtotal,
                'shipping_cost' => Order::SHIPPING_FEE,
                'total_cost' => $subtotal + Order::SHIPPING_FEE,
            ]);
        });

        if ($mode === 'buy_now') {
            $this->carts->forgetBuyNow();
            // If the same item was also sitting in the cart, take the bought quantity out of it.
            foreach ($order->cart as $line) {
                $this->carts->takeOut($user, $line['product_id'], $line['quantity']);
            }
        } else {
            $this->carts->clear($user);
        }

        return redirect()->route('orders.payment', $order);
    }

    public function payment(Request $request, Order $order)
    {
        $this->authorizeOwner($request, $order);

        if (! in_array($order->order_status, ['pending', 'paid'], true)) {
            return redirect()->route('orders.showOrders')->with('error', 'This order is no longer awaiting payment.');
        }

        return Inertia::render('Orders/GcashPayment', [
            'order' => $order->only([
                'id', 'order_status', 'subtotal', 'shipping_cost', 'total_cost', 'name', 'address', 'phone', 'cart',
            ]),
        ]);
    }

    /**
     * DEMO ONLY: there is no real payment gateway. The order owner can
     * simulate a successful or failed GCash payment.
     */
    public function simulatePayment(Request $request, Order $order)
    {
        $this->authorizeOwner($request, $order);

        $data = $request->validate(['result' => ['required', 'in:paid,failed']]);

        if ($order->order_status !== 'pending') {
            return back()->with('error', 'This order is no longer awaiting payment.');
        }

        if ($data['result'] === 'failed') {
            return back()->with('error', 'Payment failed (simulated). You can try again or cancel the order.');
        }

        $order->update(['order_status' => 'paid']);

        return back()->with('success', 'Payment successful (simulated). Thank you for your order!');
    }

    public function cancel(Request $request, Order $order)
    {
        $this->authorizeOwner($request, $order);

        if ($order->order_status !== 'pending') {
            return back()->with('error', 'Only unpaid orders can be cancelled.');
        }

        DB::transaction(function () use ($order) {
            $order->restoreStock();
            $order->update(['order_status' => 'cancelled_user']);
        });

        return redirect()->route('orders.showOrders')->with('success', 'Order cancelled.');
    }

    public function complete(Request $request, Order $order)
    {
        $this->authorizeOwner($request, $order);

        if ($order->order_status !== 'delivered') {
            return back()->with('error', 'Only delivered orders can be marked as received.');
        }

        $order->update(['order_status' => 'completed']);

        return back()->with('success', 'Thanks! Order marked as received.');
    }

    /* ----------------------------------------------------------------- */
    /*  Admin (routes are behind AdminMiddleware)                         */
    /* ----------------------------------------------------------------- */

    public function index()
    {
        return Inertia::render('Admin/Orders/Index', [
            'orders' => Order::latest()->get(),
            'cancelReasons' => Order::CANCEL_REASONS,
        ]);
    }

    public function markAsDelivered(Order $order)
    {
        if ($order->order_status !== 'paid') {
            return back()->with('error', 'Only paid orders can be marked as delivered.');
        }

        $order->update(['order_status' => 'delivered']);

        return back()->with('success', 'Order marked as delivered.');
    }

    public function adminCancel(Request $request, Order $order)
    {
        $data = $request->validate([
            'reason' => ['required', Rule::in(array_keys(Order::CANCEL_REASONS))],
        ], [
            'reason.required' => 'Choose a reason for cancelling this order.',
        ]);

        if (! in_array($order->order_status, ['pending', 'paid'], true)) {
            return back()->with('error', 'This order can no longer be cancelled.');
        }

        $wasPaid = $order->order_status === 'paid';

        DB::transaction(function () use ($order, $data) {
            $order->restoreStock();
            $order->update(['order_status' => 'cancelled_admin', 'cancellation_reason' => $data['reason']]);
        });

        return back()->with('success', $wasPaid
            ? 'Order cancelled, stock restored and the payment marked as refunded (demo).'
            : 'Order cancelled and stock restored.');
    }

    /* ----------------------------------------------------------------- */

    private function authorizeOwner(Request $request, Order $order): void
    {
        abort_unless($order->belongsToUser($request->user()), 404);
    }
}
