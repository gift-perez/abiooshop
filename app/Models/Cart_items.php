<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cart_items extends Model
{
    //
    protected $table = 'cart_items';
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'unit_price'
    ];

    public function User(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
