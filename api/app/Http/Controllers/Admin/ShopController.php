<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\StoreShopRequest;
use App\Http\Requests\Shop\UpdateShopRequest;
use App\Http\Resources\ShopResource;
use App\Models\Shop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class ShopController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $shops = Shop::query()
            ->with('owner')
            ->withCount('shopProducts')
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', '%'.$request->string('search').'%'))
            ->latest()
            ->paginate($request->integer('per_page', 15))
            ->withQueryString();

        return ShopResource::collection($shops);
    }

    public function store(StoreShopRequest $request): ShopResource
    {
        $data = $request->validated();
        $data['slug'] = $this->uniqueSlug($data['name']);

        $shop = Shop::create($data);

        return new ShopResource($shop->load('owner'));
    }

    public function show(Shop $shop): ShopResource
    {
        return new ShopResource($shop->load('owner')->loadCount('shopProducts'));
    }

    public function update(UpdateShopRequest $request, Shop $shop): ShopResource
    {
        $data = $request->validated();

        if (isset($data['name']) && $data['name'] !== $shop->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $shop->id);
        }

        $shop->update($data);

        return new ShopResource($shop->load('owner'));
    }

    public function destroy(Shop $shop): JsonResponse
    {
        $this->authorize('delete', $shop);

        $shop->delete();

        return response()->json(['message' => 'Shop deleted.']);
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;

        while (Shop::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
