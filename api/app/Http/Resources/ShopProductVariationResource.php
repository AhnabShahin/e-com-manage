<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ShopProductVariation */
class ShopProductVariationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_variation_id' => $this->product_variation_id,
            'price' => $this->price,
            'stock' => $this->stock,
            'thumbnail' => $this->thumbnail,
            'is_active' => $this->is_active,
            'variation' => new ProductVariationResource($this->whenLoaded('productVariation')),
        ];
    }
}
