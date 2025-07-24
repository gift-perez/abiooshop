<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['shirts', 'hoodies', 'accessories', 'music'];
        $collections = ['the1975', 'nbhd', 'wknd', 'focean'];

        $count = 1;

        foreach ($categories as $category) {
            foreach ($collections as $collection) {
                Product::create([
                    'id' => Str::random(20),
                    'name' => "Product $count",
                    'description' => "This is a description for Product $count in $category ($collection collection).",
                    'price' => rand(500, 2000),
                    'stock' => rand(5, 20),
                    'collection' => $collection,
                    'category' => $category,
                    'image' => 'uploads/1751600867.png'
                ]);
                $count++;
            }
        }
    }
}
