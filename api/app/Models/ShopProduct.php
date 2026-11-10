<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

/**
 * A catalog product listed inside a shop. This row is what makes a product
 * visible to customers.
 */
#[Fillable(['shop_id', 'product_id', 'price', 'thumbnail', 'details', 'is_active'])]
class ShopProduct extends Model
{
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::deleting(function (ShopProduct $shopProduct) {
            if ($shopProduct->thumbnail && Storage::disk('public')->exists($shopProduct->thumbnail)) {
                Storage::disk('public')->delete($shopProduct->thumbnail);
            }
        });
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** Shop-specific price/stock per master variation. */
    public function variations(): HasMany
    {
        return $this->hasMany(ShopProductVariation::class);
    }

    /** Only listings customers are allowed to see (active + in an active shop). */
    public function scopeVisibleToCustomers(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->whereHas('shop', fn (Builder $q) => $q->where('is_active', true));
    }
}
