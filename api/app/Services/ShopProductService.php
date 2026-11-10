<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ShopProductService
{
    public function __construct(private readonly FileUploadService $files)
    {
    }

    /**
     * List a catalog product inside a shop. For simple products a price is set on
     * the listing; for variable products a price per selected variation is set.
     *
     * @param  array<string,mixed>  $data
     */
    public function attach(Shop $shop, Product $product, array $data, ?UploadedFile $thumbnail = null): ShopProduct
    {
        if ($shop->shopProducts()->where('product_id', $product->id)->exists()) {
            throw ValidationException::withMessages([
                'product_id' => 'This product is already listed in the shop.',
            ]);
        }

        return DB::transaction(function () use ($shop, $product, $data, $thumbnail) {
            $shopProduct = $shop->shopProducts()->create([
                'product_id' => $product->id,
                'price' => $product->isVariable() ? null : ($data['price'] ?? 0),
                'thumbnail' => $thumbnail ? $this->files->store($thumbnail, 'shop-products') : null,
                'details' => $data['details'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            if ($product->isVariable()) {
                $this->syncVariations($shopProduct, $product, $data['variations'] ?? []);
            }

            return $this->loaded($shopProduct);
        });
    }

    /**
     * Update a listing's shop-specific fields, variation prices, and thumbnail.
     *
     * @param  array<string,mixed>  $data
     */
    public function update(ShopProduct $shopProduct, array $data, ?UploadedFile $thumbnail = null, bool $removeThumbnail = false): ShopProduct
    {
        return DB::transaction(function () use ($shopProduct, $data, $thumbnail, $removeThumbnail) {
            // Replace or remove the uploaded thumbnail, cleaning up the old file.
            if ($thumbnail) {
                $this->files->delete($shopProduct->thumbnail);
                $shopProduct->thumbnail = $this->files->store($thumbnail, 'shop-products');
            } elseif ($removeThumbnail) {
                $this->files->delete($shopProduct->thumbnail);
                $shopProduct->thumbnail = null;
            }

            $shopProduct->fill([
                'price' => $shopProduct->product->isVariable()
                    ? null
                    : ($data['price'] ?? $shopProduct->price),
                'details' => array_key_exists('details', $data) ? $data['details'] : $shopProduct->details,
                'is_active' => $data['is_active'] ?? $shopProduct->is_active,
            ])->save();

            if ($shopProduct->product->isVariable() && array_key_exists('variations', $data)) {
                $this->syncVariations($shopProduct, $shopProduct->product, $data['variations']);
            }

            return $this->loaded($shopProduct);
        });
    }

    /**
     * @param  array<int,array{product_variation_id:int,price:float,stock?:int,is_active?:bool}>  $variations
     */
    private function syncVariations(ShopProduct $shopProduct, Product $product, array $variations): void
    {
        $validIds = $product->variations()->pluck('id')->all();
        $keep = [];

        foreach ($variations as $row) {
            if (! in_array($row['product_variation_id'], $validIds, true)) {
                continue;
            }

            $record = $shopProduct->variations()->updateOrCreate(
                ['product_variation_id' => $row['product_variation_id']],
                [
                    'price' => $row['price'],
                    'stock' => $row['stock'] ?? 0,
                    'is_active' => $row['is_active'] ?? true,
                ],
            );
            $keep[] = $record->id;
        }

        $shopProduct->variations()->whereNotIn('id', $keep)->delete();
    }

    private function loaded(ShopProduct $shopProduct): ShopProduct
    {
        return $shopProduct->load([
            'product.variations',
            'product.category',
            'product.images',
            'variations.productVariation',
            'shop',
        ]);
    }
}
