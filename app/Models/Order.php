<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{

    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected  $fillable = [
        'id',
        'status',
        'subtotal',
        'shipping_cost',
        'total_cost',
        'notes',
        'name',
        'address',
        'phone',
        'user_id',
        'cart'
    ];
}
