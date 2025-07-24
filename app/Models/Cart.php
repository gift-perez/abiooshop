<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory, HasUuids;

    protected  $fillable = [
        'status',
        'user_id',
        'subtotal',
        'shipping_cost',
        'total_cost',
        'num_items'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function cartItems() {
        return $this->hasMany(CartItem::class);
    }

    public function getItems(){
        $cartItems = CartItem::where('cart_id', $this->id)->first();
        return $cartItems;
    }

    public function countItems(){
        $this->num_items = $this->getItems()->count();
        $this->save();

        return $this->num_items;
    }

    public function recalculateTotals()
    {

        // $items = $this->getItems();
        // $newCartSubtotal = 0.00;
        // foreach($items as $item){
        //     $newCartSubtotal = $newCartSubtotal + floatval($item->subtotal);
        // }
        // Update the cart's subtotal attribute
        $this->subtotal = $this->cartItems()->sum('subtotal');

        $this->total_cost = $this->subtotal + $this->shipping_cost;
        $this->num_items = $this->cartItems()->count();
        $this->save();
    }

}
