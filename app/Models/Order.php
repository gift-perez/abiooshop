<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    public const SHIPPING_FEE = 100.00;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'order_status',
        'subtotal',
        'shipping_cost',
        'total_cost',
        'notes',
        'name',
        'address',
        'phone',
        'user_id',
        'cart',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'float',
            'shipping_cost' => 'float',
            'total_cost' => 'float',
            'cart' => 'array',
            'payment_initiated' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        // Short, human-friendly order reference (e.g. "K3F9QZ2M8XWD").
        static::creating(function (Order $order) {
            if (empty($order->id)) {
                do {
                    $id = strtoupper(Str::random(12));
                } while (static::whereKey($id)->exists());

                $order->id = $id;
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function belongsToUser(?User $user): bool
    {
        return $user !== null && $this->user_id === $user->id;
    }

    /**
     * Put the reserved stock back (used when an order is cancelled).
     */
    public function restoreStock(): void
    {
        foreach ($this->cart ?? [] as $item) {
            Product::whereKey($item['product_id'])->increment('stock', (int) $item['quantity']);
        }
    }
}
