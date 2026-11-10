<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * The shared product catalog. Both admins and shop owners use these endpoints:
 * everyone can browse, and either role can create a product (it becomes available
 * to every shop owner). Editing/deleting is governed by ProductPolicy.
 */
class ProductController extends Controller
{
    public function __construct(private readonly ProductService $products)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Product::class);

        $shopId = $request->integer('shop_id') ?: null;

        $products = Product::query()
            ->with(['category', 'creator', 'images'])
            ->withCount('variations')
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('category_id'), fn ($q) => $q->where('category_id', $request->integer('category_id')))
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->string('type')))
            // Annotate whether the given shop already lists each product.
            ->when($shopId, fn ($q) => $q->withExists([
                'shopProducts as listed_in_shop' => fn ($sq) => $sq->where('shop_id', $shopId),
            ]))
            ->latest()
            ->paginate($request->integer('per_page', 15))
            ->withQueryString();

        return ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request): ProductResource
    {
        $product = $this->products->create(
            $request->validated(),
            $request->user(),
            $request->file('images', []),
        );

        return new ProductResource($product);
    }

    public function show(Product $product): ProductResource
    {
        $this->authorize('view', $product);

        return new ProductResource($product->load(['category', 'creator', 'variations', 'images']));
    }

    public function update(UpdateProductRequest $request, Product $product): ProductResource
    {
        $product = $this->products->update(
            $product,
            $request->validated(),
            $request->file('images', []),
        );

        return new ProductResource($product);
    }

    public function destroy(Product $product): \Illuminate\Http\JsonResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }
}
