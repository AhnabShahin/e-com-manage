<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShopProductResource;
use App\Http\Resources\ShopResource;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Public customer-facing endpoints. Customers only ever see products that are
 * actively listed in an active shop; catalog products with no shop listing are
 * never exposed here.
 */
class StorefrontController extends Controller
{
    /** Active shops that have at least one visible product. */
    public function shops(Request $request): AnonymousResourceCollection
    {
        $shops = Shop::query()
            ->where('is_active', true)
            ->withCount(['shopProducts' => fn (Builder $q) => $q->where('is_active', true)])
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', '%'.$request->string('search').'%'))
            ->orderBy('name')
            ->paginate($request->integer('per_page', 12))
            ->withQueryString();

        return ShopResource::collection($shops);
    }

    public function shop(Shop $shop): ShopResource
    {
        abort_unless($shop->is_active, 404);

        return new ShopResource($shop->loadCount(['shopProducts' => fn (Builder $q) => $q->where('is_active', true)]));
    }

    /** Products listed in a shop, with shop-specific price/thumbnail. */
    public function products(Request $request, Shop $shop): AnonymousResourceCollection
    {
        abort_unless($shop->is_active, 404);

        $products = $shop->shopProducts()
            ->visibleToCustomers()
            ->with(['product.category', 'product.images'])
            ->withMin('variations', 'price')
            ->withMax('variations', 'price')
            ->when($request->filled('search'), fn ($q) => $q->whereHas(
                'product',
                fn ($p) => $p->where('name', 'like', '%'.$request->string('search').'%')
            ))
            ->when($request->filled('category_id'), fn ($q) => $q->whereHas(
                'product',
                fn ($p) => $p->where('category_id', $request->integer('category_id'))
            ))
            ->latest()
            ->paginate($request->integer('per_page', 12))
            ->withQueryString();

        return ShopProductResource::collection($products);
    }

    /** A single listed product with its variations (customer detail page). */
    public function product(Shop $shop, ShopProduct $shopProduct): ShopProductResource
    {
        abort_unless($shop->is_active, 404);

        if ($shopProduct->shop_id !== $shop->id || ! $shopProduct->is_active) {
            throw new NotFoundHttpException('Product not found in this shop.');
        }

        return new ShopProductResource(
            $shopProduct->load([
                'product.category',
                'product.variations',
                'product.images',
                'variations' => fn ($q) => $q->where('is_active', true),
                'variations.productVariation',
                'shop',
            ])
        );
    }
}
