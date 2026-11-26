<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    /** The headline band; keep in sync with FEATURED_COLLECTION in resources/js/lib/catalog.ts. */
    public const FEATURED = 'the1975';

    public function home()
    {
        $collections = Product::query()
            ->selectRaw('collection, count(*) as count, min(image) as image')
            ->where('collection', '!=', self::FEATURED)
            ->groupBy('collection')
            ->get();

        return Inertia::render('guest', [
            'featured' => Product::where('collection', self::FEATURED)->orderBy('category')->get(),
            'products' => Product::latest()->take(8)->get(),
            'collections' => $collections,
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
            ->orderByRaw('CASE WHEN collection = ? THEN 0 ELSE 1 END', [self::FEATURED]) // headline band first
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
