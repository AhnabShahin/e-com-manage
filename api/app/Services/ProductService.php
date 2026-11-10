<?php

namespace App\Services;

use App\Enums\ProductType;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(private readonly FileUploadService $files)
    {
    }

    /**
     * Create a product in the shared catalog, optionally with master variations and
     * uploaded images. Images are stored only as part of this save (nothing is
     * uploaded before the product is persisted).
     *
     * @param  array<string,mixed>  $data        validated scalar/array fields
     * @param  array<int,UploadedFile>  $images   uploaded image files, in order
     */
    public function create(array $data, User $creator, array $images = []): Product
    {
        return DB::transaction(function () use ($data, $creator, $images) {
            $product = Product::create([
                'created_by' => $creator->id,
                'category_id' => $data['category_id'] ?? null,
                'name' => $data['name'],
                'slug' => $this->uniqueSlug($data['name']),
                'description' => $data['description'] ?? null,
                'type' => $data['type'],
            ]);

            if ($product->type === ProductType::Variable) {
                $this->syncVariations($product, $data['variations'] ?? []);
            }

            $this->addImages($product, $images, $data['featured_new_index'] ?? 0);

            return $product->load('variations', 'category', 'creator', 'images');
        });
    }

    /**
     * Update catalog-level fields, variations, and images (add new uploads, remove
     * selected existing images, and re-point the feature image).
     *
     * @param  array<string,mixed>  $data
     * @param  array<int,UploadedFile>  $images
     */
    public function update(Product $product, array $data, array $images = []): Product
    {
        return DB::transaction(function () use ($product, $data, $images) {
            $product->fill([
                'category_id' => $data['category_id'] ?? $product->category_id,
                'name' => $data['name'] ?? $product->name,
                'description' => array_key_exists('description', $data) ? $data['description'] : $product->description,
            ]);

            if (array_key_exists('name', $data) && $data['name'] !== $product->getOriginal('name')) {
                $product->slug = $this->uniqueSlug($data['name'], $product->id);
            }

            $product->save();

            if ($product->isVariable() && array_key_exists('variations', $data)) {
                $this->syncVariations($product, $data['variations']);
            }

            // Remove images the user deleted (files are unlinked via model events).
            foreach ($data['removed_image_ids'] ?? [] as $imageId) {
                $product->images()->whereKey($imageId)->get()->each->delete();
            }

            $newImages = $this->addImages($product, $images);

            $this->applyFeatured(
                $product,
                existingId: $data['featured_image_id'] ?? null,
                newImage: isset($data['featured_new_index']) ? ($newImages[$data['featured_new_index']] ?? null) : null,
            );

            return $product->load('variations', 'category', 'creator', 'images');
        });
    }

    /**
     * Store uploaded images for a product.
     *
     * @param  array<int,UploadedFile>  $images
     * @return array<int,ProductImage>  created rows, in upload order
     */
    private function addImages(Product $product, array $images, ?int $featuredIndex = null): array
    {
        $created = [];
        $startOrder = (int) $product->images()->max('sort_order') + 1;

        foreach (array_values($images) as $i => $file) {
            $path = $this->files->store($file, 'products');
            $created[$i] = $product->images()->create([
                'path' => $path,
                'sort_order' => $startOrder + $i,
                'is_featured' => $featuredIndex !== null && $featuredIndex === $i,
            ]);
        }

        // On create, make sure exactly one image is featured.
        if ($featuredIndex !== null && $created && ! $product->images()->where('is_featured', true)->exists()) {
            $created[0]->update(['is_featured' => true]);
        }

        return $created;
    }

    /** Point the feature flag at the chosen image (existing or newly uploaded). */
    private function applyFeatured(Product $product, ?int $existingId, ?ProductImage $newImage): void
    {
        $target = $newImage;
        if (! $target && $existingId) {
            $target = $product->images()->whereKey($existingId)->first();
        }

        if ($target) {
            $product->images()->update(['is_featured' => false]);
            $target->update(['is_featured' => true]);
        } elseif (! $product->images()->where('is_featured', true)->exists()) {
            // Guarantee a feature image exists if any images remain.
            $product->images()->oldest('sort_order')->first()?->update(['is_featured' => true]);
        }
    }

    /**
     * @param  array<int,array{id?:int,name:string,sku?:?string,attributes?:?array}>  $variations
     */
    private function syncVariations(Product $product, array $variations): void
    {
        $keepIds = [];

        foreach ($variations as $row) {
            $variation = $product->variations()->updateOrCreate(
                ['id' => $row['id'] ?? null],
                [
                    'name' => $row['name'],
                    'sku' => $row['sku'] ?? null,
                    'attributes' => $row['attributes'] ?? null,
                ],
            );
            $keepIds[] = $variation->id;
        }

        $product->variations()->whereNotIn('id', $keepIds)->delete();
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;

        while (Product::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
