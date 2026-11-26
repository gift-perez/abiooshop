<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Demo catalogue. Only runs when the products table is empty,
     * so redeploys don't create duplicates.
     */
    public function run(): void
    {
        if (Product::exists()) {
            return;
        }

        $categories = ['shirts', 'hoodies', 'accessories', 'music'];
        $collections = ['the1975', 'nbhd', 'wknd', 'focean'];

        $count = 1;

        foreach ($categories as $category) {
            foreach ($collections as $collection) {
                Product::create([
                    'name' => "Product $count",
                    'description' => "This is a description for Product $count in $category ($collection collection).",
                    'price' => rand(500, 2000),
                    'stock' => rand(5, 20),
                    'collection' => $collection,
                    'category' => $category,
                    'image' => 'uploads/1751600867.png',
                ]);
                $count++;
            }
        }
    }
}
