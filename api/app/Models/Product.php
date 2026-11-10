<?php

namespace App\Models;

use App\Enums\ProductType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A product in the shared / master catalog. Created by an admin or a shop owner,
 * available for any shop owner to list in their shop.
 */
#[Fillable(['created_by', 'category_id', 'name', 'slug', 'description', 'type', 'thumbnail'])]
class Product extends Model
{
    protected function casts(): array
    {
        return ['type' => ProductType::class];
    }

    protected static function booted(): void
    {
        // Deleting a product must also clean up its image files. A DB cascade would
        // skip model events, so delete images through the model to fire cleanup.
        static::deleting(function (Product $product) {
            $product->images()->get()->each->delete();
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderByDesc('is_featured')->orderBy('sort_order');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** Master-level variations (only for variable products). */
    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }

    /** Shop listings of this product across all shops. */
    public function shopProducts(): HasMany
    {
        return $this->hasMany(ShopProduct::class);
    }

    public function isVariable(): bool
    {
        return $this->type === ProductType::Variable;
    }

    public function getRouteKeyName(): string
    {
        return 'id';
    }
}
