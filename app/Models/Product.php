<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'collection',
        'category',
        'image',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'stock' => 'integer',
        ];
    }

    public function fromCollection()
    {
        return Product::where('collection', $this->collection)
            ->whereNot('id', $this->id)
            ->get();
    }

    public function fromCategory()
    {
        return Product::where('category', $this->category)
            ->whereNot('id', $this->id)
            ->get();
    }
}
