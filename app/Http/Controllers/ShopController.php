<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    //

    public function index(){

        $products = Product::all();

        return Inertia::render('Shop/Index', [
            'products' => $products
        ]);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return Inertia::render('Shop/Show', [
            'product' => $product,
            'collectionProducts' => $product->fromCollection(),
            'categoryProducts' => $product->fromCategory()
        ]);
    }


    public function filterbyPrice(Request $request)
    {
        $minPrice = $request->input('min_price', 0);
        $maxPrice = $request->input('max_price', PHP_INT_MAX);

        $products = Product::whereBetween('price', [$minPrice, $maxPrice])->get();

        return Inertia::render('Shop/Index', [
            'products' => $products
        ]);
    }

    public function filterbyCategory(Request $request)
    {
        $selected = $request->input('category');


        $products = Product::where('category', $selected)->get();

        return Inertia::render('Shop/Index', [
            'products' => $products
        ]);
    }

    public function filterbyCollection(Request $request)
    {
        $selected = $request->input('collection');
        $products = Product::where('collection', $selected)->get();

        return Inertia::render('Shop/Index', [
            'products' => $products
        ]);
    }
}
