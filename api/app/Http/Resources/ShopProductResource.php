<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ShopProduct */
class ShopProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isVariable = $this->relationLoaded('product') && $this->product->isVariable();

        return [
            'id' => $this->id,
            'shop_id' => $this->shop_id,
            'product_id' => $this->product_id,
            'price' => $this->price,
            // Range for variable products (populated via withMin/withMax in listings).
            'price_from' => $this->variations_min_price ?? $this->price,
            'price_to' => $this->variations_max_price ?? $this->price,
            'thumbnail' => $this->resolvedThumbnail(),
            'details' => $this->details,
            'is_active' => $this->is_active,
            'is_variable' => $isVariable,
            'shop' => new ShopResource($this->whenLoaded('shop')),
            'product' => new ProductResource($this->whenLoaded('product')),
            'variations' => ShopProductVariationResource::collection($this->whenLoaded('variations')),
            'created_at' => $this->created_at,
        ];
    }

    /** Prefer the shop's own uploaded thumbnail, fall back to the catalog image. */
    private function resolvedThumbnail(): ?string
    {
        if ($this->thumbnail) {
            return str_starts_with($this->thumbnail, 'http')
                ? $this->thumbnail
                : \Illuminate\Support\Facades\Storage::disk('public')->url($this->thumbnail);
        }

        if ($this->relationLoaded('product')) {
            return (new ProductResource($this->product))->toArray(request())['primary_image'] ?? null;
        }

        return null;
    }
}
