<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Sample orders so the admin Orders page and the demo customer's order
 * tracking aren't empty. All names, addresses and phone numbers are fake.
 *
 * Runs once: if the demo customer already has orders, nothing happens, so
 * redeploys don't add duplicates. Stock is not touched.
 *
 * The demo customer can only be logged into when DEMO_PASSWORD is set.
 */
class DemoOrderSeeder extends Seeder
{
    /** [status, days ago, receiver, [[collection, category, qty], ...]] */
    private const ORDERS = [
        ['completed', 12, 'Juan Dela Cruz', [['the1975', 'shirts', 1], ['the1975', 'music', 1]]],
        ['cancelled_user', 9, 'Maria Clara Santos', [['nbhd', 'accessories', 2]]],
        ['delivered', 6, 'Pedro Penduko', [['wknd', 'hoodies', 1]]],
        ['paid', 3, 'Juana Reyes', [['focean', 'music', 1], ['focean', 'shirts', 1]]],
        ['cancelled_admin', 2, 'Andres Bautista', [['the1975', 'hoodies', 1]]],
        ['paid', 1, 'Liza Mendoza', [['the1975', 'accessories', 1], ['nbhd', 'shirts', 2]]],
        ['pending', 0, 'Carlo Villanueva', [['wknd', 'music', 1]]],
    ];

    public function run(): void
    {
        $customer = $this->demoCustomer();

        if ($customer->orders()->exists()) {
            return;
        }

        foreach (self::ORDERS as $i => [$status, $daysAgo, $receiver, $items]) {
            $lines = [];

            foreach ($items as [$collection, $category, $qty]) {
                $product = Product::where('collection', $collection)->where('category', $category)->first();
                if (! $product) {
                    continue;
                }

                $lines[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'quantity' => $qty,
                    'price' => $product->price,
                    'subtotal' => round($qty * $product->price, 2),
                    'image' => $product->image,
                ];
            }

            if (! $lines) {
                continue;
            }

            $subtotal = round(array_sum(array_column($lines, 'subtotal')), 2);
            $placedAt = now()->subDays($daysAgo)->subMinutes(37 * ($i + 1));

            $order = Order::create([
                'user_id' => $customer->id,
                'name' => $receiver,
                'address' => sprintf('Unit %d, %d Sample Street, Quezon City (demo address)', $i + 1, 100 + $i * 7),
                'phone' => sprintf('090000000%02d', $i + 1),   // fake, not a real network prefix
                'order_status' => $status,
                'cart' => $lines,
                'subtotal' => $subtotal,
                'shipping_cost' => Order::SHIPPING_FEE,
                'total_cost' => $subtotal + Order::SHIPPING_FEE,
            ]);

            $order->forceFill(['created_at' => $placedAt, 'updated_at' => $placedAt])->saveQuietly();
        }
    }

    private function demoCustomer(): User
    {
        $email = config('shop.demo.email');
        $password = config('shop.demo.password');

        $customer = User::firstOrNew(['email' => $email]);
        $customer->name = $customer->name ?: 'Demo Fan';

        if ($password) {
            $customer->password = $password;           // hashed by the model cast
        } elseif (! $customer->exists) {
            $customer->password = Str::random(40);     // nobody can log in until DEMO_PASSWORD is set
        }

        $customer->forceFill(['role' => 'user', 'email_verified_at' => $customer->email_verified_at ?? now()]);
        $customer->save();

        return $customer;
    }
}
