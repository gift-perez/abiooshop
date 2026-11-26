<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function home()
    {
        return Inertia::render('guest', [
            'products' => Product::latest()->take(8)->get(),
        ]);
    }

    /**
     * Product listing. Optional filters: ?category=shirts&collection=the1975
     */
    public function index(Request $request)
    {
        $products = Product::query()
            ->when($request->query('category'), fn ($q, $category) => $q->where('category', $category))
            ->when($request->query('collection'), fn ($q, $collection) => $q->where('collection', $collection))
            ->latest()
            ->get();

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'filters' => $request->only('category', 'collection'),
        ]);
    }

    public function show(Product $product)
    {
        return Inertia::render('Shop/Show', [
            'product' => $product,
            'collectionProducts' => $product->fromCollection(),
            'categoryProducts' => $product->fromCategory(),
        ]);
    }
}
