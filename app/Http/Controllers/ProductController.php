<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Admin product management. All routes are behind AdminMiddleware.
 */
class ProductController extends Controller
{
    private const UPLOAD_DIR = 'uploads';

    public function index()
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(imageRequired: true));

        $data['image'] = $this->storeImage($request->file('image'));
        Product::create($data);

        return redirect()->route('products.index')->with('success', 'Product created.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate($this->rules(imageRequired: false));

        if ($request->hasFile('image')) {
            $old = $product->image;
            $data['image'] = $this->storeImage($request->file('image'));
            $this->deleteImageIfUnused($old, $product->id);
        } else {
            unset($data['image']);
        }

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        $image = $product->image;
        $product->delete();
        $this->deleteImageIfUnused($image, $product->id);

        return redirect()->route('products.index')->with('success', 'Product deleted.');
    }

    /* ----------------------------------------------------------------- */

    private function rules(bool $imageRequired): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999'],
            'stock' => ['required', 'integer', 'min:0'],
            'collection' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'image' => [$imageRequired ? 'required' : 'nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
        ];
    }

    private function storeImage(UploadedFile $file): string
    {
        $dir = public_path(self::UPLOAD_DIR);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $name = Str::uuid().'.'.$file->extension();
        $file->move($dir, $name);

        return self::UPLOAD_DIR.'/'.$name;
    }

    /**
     * Several products can share one image (e.g. seeded data), so only
     * delete the file when no other product still points at it.
     */
    private function deleteImageIfUnused(?string $path, string $exceptProductId): void
    {
        if (! $path || ! str_starts_with($path, self::UPLOAD_DIR.'/')) {
            return;
        }

        $stillUsed = Product::where('image', $path)->whereKeyNot($exceptProductId)->exists();
        $fullPath = public_path($path);

        if (! $stillUsed && is_file($fullPath)) {
            @unlink($fullPath);
        }
    }
}
