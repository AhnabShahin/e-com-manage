<?php

namespace App\Http\Controllers;

use App\Http\Requests\Order\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Shop;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orders)
    {
    }

    /** Customer: place an order from the cart (split per shop). */
    public function store(CheckoutRequest $request): AnonymousResourceCollection
    {
        $orders = $this->orders->checkout($request->user(), $request->validated()['items']);

        return OrderResource::collection($orders);
    }

    /** Customer: their own order history. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = Order::where('customer_id', $request->user()->id)
            ->with(['shop', 'items'])
            ->withCount('items')
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return OrderResource::collection($orders);
    }

    public function show(Order $order): OrderResource
    {
        $this->authorize('view', $order);

        return new OrderResource($order->load(['shop', 'items', 'customer']));
    }

    /** Shop owner/admin: orders placed in a given shop. */
    public function shopOrders(Request $request, Shop $shop): AnonymousResourceCollection
    {
        $this->authorize('manageListings', $shop);

        $orders = $shop->orders()
            ->with(['customer', 'items'])
            ->withCount('items')
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return OrderResource::collection($orders);
    }

    /** Shop owner/admin: advance an order's status. */
    public function updateStatus(Request $request, Order $order): OrderResource
    {
        $this->authorize('update', $order);

        $data = $request->validate([
            'status' => ['required', Rule::in(['pending', 'completed', 'cancelled'])],
        ]);

        $order->update($data);

        return new OrderResource($order->load(['shop', 'items', 'customer']));
    }
}
