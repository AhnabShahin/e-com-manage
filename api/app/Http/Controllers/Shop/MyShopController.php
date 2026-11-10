<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShopResource;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Shops the authenticated owner can manage (all shops for an admin). */
class MyShopController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $shops = Shop::query()
            ->with('owner')
            ->withCount('shopProducts')
            ->when(! $user->isAdmin(), fn ($q) => $q->where('owner_id', $user->id))
            ->latest()
            ->get();

        return ShopResource::collection($shops);
    }

    public function show(Request $request, Shop $shop): ShopResource
    {
        $this->authorize('view', $shop);

        return new ShopResource($shop->load('owner')->loadCount('shopProducts'));
    }
}
