<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'status',
        'user_id',
        'subtotal',
        'shipping_cost',
        'total_cost',
        'num_items',
    ];

    /**
     * Mirror the database defaults so a freshly created cart has usable values.
     */
    protected $attributes = [
        'status' => 'active',
        'subtotal' => 0,
        'shipping_cost' => Order::SHIPPING_FEE,
        'total_cost' => 0,
        'num_items' => 0,
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'float',
            'shipping_cost' => 'float',
            'total_cost' => 'float',
            'num_items' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function recalculateTotals(): void
    {
        $this->subtotal = (float) $this->cartItems()->sum('subtotal');
        $this->num_items = $this->cartItems()->count();
        $this->total_cost = $this->num_items > 0 ? $this->subtotal + $this->shipping_cost : 0;
        $this->save();
    }
}
