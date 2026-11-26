<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasUuids;

    protected $fillable = [
        'product_id',
        'user_id',
        'cart_id',
        'quantity',
        'subtotal',
        'stock',
        'price',
        'image',
        'name',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'stock' => 'integer',
            'price' => 'float',
            'subtotal' => 'float',
        ];
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
