<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //

    public $incrementing = false;
    protected $keyType = 'string';

    protected  $fillable = [
        'id',
        'name',
        'description',
        'price',
        'stock',
        'collection',
        'category',
        'image'
    ];

    public function fromCollection()
    {
        $collectionProducts = Product::where('collection', $this->collection)
            ->whereNot('id', $this->id)
            ->get();
        return $collectionProducts;
    }


    public function fromCategory()
    {
        $categoryProducts = Product::where('category', $this->category)
            ->whereNot('id', $this->id)
            ->get();
        return $categoryProducts;
    }






}
