<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopProduct\AttachShopProductRequest;
use App\Http\Requests\ShopProduct\UpdateShopProductRequest;
use App\Http\Resources\ShopProductResource;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Services\ShopProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Shop owners manage which catalog products their shop lists, and at what price. */
class ShopProductController extends Controller
{
    public function __construct(private readonly ShopProductService $service)
    {
    }

    public function index(Request $request, Shop $shop): AnonymousResourceCollection
    {
        $this->authorize('manageListings', $shop);

        $listings = $shop->shopProducts()
            ->with(['product.category', 'product.images', 'variations.productVariation'])
            ->when($request->filled('search'), fn ($q) => $q->whereHas(
                'product',
                fn ($p) => $p->where('name', 'like', '%'.$request->string('search').'%')
            ))
            ->latest()
            ->paginate($request->integer('per_page', 15))
            ->withQueryString();

        return ShopProductResource::collection($listings);
    }

    public function store(AttachShopProductRequest $request, Shop $shop): ShopProductResource
    {
        $this->authorize('manageListings', $shop);

        $product = Product::findOrFail($request->integer('product_id'));

        $shopProduct = $this->service->attach($shop, $product, $request->validated(), $request->file('thumbnail'));

        return new ShopProductResource($shopProduct);
    }

    public function show(ShopProduct $shopProduct): ShopProductResource
    {
        $this->authorize('view', $shopProduct);

        return new ShopProductResource(
            $shopProduct->load(['product.category', 'product.variations', 'product.images', 'variations.productVariation', 'shop'])
        );
    }

    public function update(UpdateShopProductRequest $request, ShopProduct $shopProduct): ShopProductResource
    {
        $shopProduct = $this->service->update(
            $shopProduct,
            $request->validated(),
            $request->file('thumbnail'),
            $request->boolean('remove_thumbnail'),
        );

        return new ShopProductResource($shopProduct);
    }

    public function destroy(ShopProduct $shopProduct): JsonResponse
    {
        $this->authorize('delete', $shopProduct);

        $shopProduct->delete();

        return response()->json(['message' => 'Listing removed.']);
    }
}
