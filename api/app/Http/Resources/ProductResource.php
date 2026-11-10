<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Product */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'type' => $this->type->value,
            'primary_image' => $this->primaryImage(),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'creator' => new UserResource($this->whenLoaded('creator')),
            'variations' => ProductVariationResource::collection($this->whenLoaded('variations')),
            'variations_count' => $this->whenCounted('variations'),
            'listed_in_shop' => $this->when(isset($this->listed_in_shop), fn () => (bool) $this->listed_in_shop),
            'created_at' => $this->created_at,
        ];
    }

    /** Featured uploaded image, else the first image, else the legacy thumbnail URL. */
    private function primaryImage(): ?string
    {
        if ($this->relationLoaded('images') && $this->images->isNotEmpty()) {
            $featured = $this->images->firstWhere('is_featured', true) ?? $this->images->first();
            return $featured->url();
        }

        if ($this->thumbnail) {
            return str_starts_with($this->thumbnail, 'http')
                ? $this->thumbnail
                : Storage::disk('public')->url($this->thumbnail);
        }

        return null;
    }
}
