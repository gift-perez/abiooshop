<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

/**
 * Demo catalogue: one product per band × category.
 *
 * Product photos live in public/images/products/{collection}/ and are named
 * {collection}_{category}.{ext}, e.g. images/products/the1975/the1975_shirt.jpg.
 * Singular or plural category names both work (shirt/shirts, hoodie/hoodies,
 * accessory/accessories, music), as do jpg, jpeg, png, webp and avif.
 *
 * Safe to run on every deploy:
 *  - an empty table gets the full catalogue;
 *  - products still showing the placeholder (or an image from the product
 *    folder) pick up a matching photo as soon as one is added;
 *  - admin-uploaded images (uploads/...) are never touched.
 */
class ProductSeeder extends Seeder
{
    public const IMAGE_DIR = 'images/products';

    public const PLACEHOLDER = self::IMAGE_DIR.'/placeholder.png';

    private const BANDS = [
        'the1975' => 'The 1975',
        'nbhd' => 'The Neighbourhood',
        'wknd' => 'The Weeknd',
        'focean' => 'Frank Ocean',
    ];

    /** category => [file-name aliases, product name suffix, description template, price, stock] */
    private const CATEGORIES = [
        'shirts' => [['shirt', 'shirts'], 'Graphic Tee', 'Soft cotton crew-neck tee with %s artwork printed on the front. Regular fit.', 1200, 20],
        'hoodies' => [['hoodie', 'hoodies'], 'Pullover Hoodie', 'Heavyweight fleece pullover hoodie with %s graphics and a kangaroo pocket.', 2400, 12],
        'accessories' => [['accessory', 'accessories'], 'Tote Bag', 'Sturdy canvas tote bag printed with %s artwork. Fits a laptop and a few records.', 650, 25],
        'music' => [['music'], 'Vinyl Record', 'Standard black vinyl LP of a %s album, in a printed sleeve.', 1950, 8],
    ];

    private const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

    public function run(): void
    {
        if (! Product::exists()) {
            $this->createCatalogue();
        }

        $this->renameLegacyPlaceholders();
        $this->syncImages();
    }

    private function createCatalogue(): void
    {
        foreach (self::CATEGORIES as $category => [, $suffix, $description, $price, $stock]) {
            foreach (self::BANDS as $collection => $band) {
                Product::create([
                    'name' => "$band $suffix",
                    'description' => sprintf($description, $band),
                    'price' => $price,
                    'stock' => $stock,
                    'collection' => $collection,
                    'category' => $category,
                    'image' => self::PLACEHOLDER,
                ]);
            }
        }
    }

    /** Databases seeded by the first version have "Product 1".."Product 16"; give them real names. */
    private function renameLegacyPlaceholders(): void
    {
        Product::where('name', 'like', 'Product %')->each(function (Product $product) {
            if (! preg_match('/^Product \d+$/', $product->name)) {
                return;
            }
            $band = self::BANDS[$product->collection] ?? null;
            $meta = self::CATEGORIES[$product->category] ?? null;
            if (! $band || ! $meta) {
                return;
            }

            $product->update([
                'name' => "$band {$meta[1]}",
                'description' => sprintf($meta[2], $band),
            ]);
        });
    }

    private function syncImages(): void
    {
        Product::all()->each(function (Product $product) {
            $isManaged = $product->image === 'uploads/1751600867.png'   // the old shared placeholder
                || str_starts_with((string) $product->image, self::IMAGE_DIR.'/');

            if (! $isManaged) {
                return; // an admin uploaded a custom image; keep it
            }

            $image = $this->findImage($product->collection, $product->category) ?? self::PLACEHOLDER;

            if ($product->image !== $image) {
                $product->update(['image' => $image]);
            }
        });
    }

    private function findImage(string $collection, string $category): ?string
    {
        $aliases = self::CATEGORIES[$category][0] ?? [$category];

        foreach ($aliases as $alias) {
            foreach (self::EXTENSIONS as $ext) {
                foreach ([$ext, strtoupper($ext)] as $e) {
                    $relative = self::IMAGE_DIR."/$collection/{$collection}_{$alias}.$e";
                    if (is_file(public_path($relative))) {
                        return $relative;
                    }
                }
            }
        }

        return null;
    }
}
