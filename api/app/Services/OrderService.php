<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ShopProduct;
use App\Models\ShopProductVariation;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * Turn a cart into orders. Prices are always resolved server-side (never trusted
     * from the client), and a multi-shop cart becomes one order per shop.
     *
     * @param  array<int,array{shop_product_id:int,shop_product_variation_id?:?int,quantity:int}>  $items
     * @return array<int,Order>
     */
    public function checkout(User $customer, array $items): array
    {
        return DB::transaction(function () use ($customer, $items) {
            $linesByShop = [];

            foreach ($items as $row) {
                /** @var ShopProduct $shopProduct */
                $shopProduct = ShopProduct::with(['product', 'shop'])->find($row['shop_product_id']);

                if (! $shopProduct || ! $shopProduct->is_active || ! $shopProduct->shop->is_active) {
                    throw ValidationException::withMessages(['items' => 'A product in your cart is no longer available.']);
                }

                $quantity = (int) $row['quantity'];
                [$unitPrice, $variationName, $variation] = $this->resolveLine($shopProduct, $row['shop_product_variation_id'] ?? null);

                if ($variation && $variation->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Not enough stock for {$shopProduct->product->name} ({$variationName}).",
                    ]);
                }

                $linesByShop[$shopProduct->shop_id][] = [
                    'shop_product_id' => $shopProduct->id,
                    'shop_product_variation_id' => $variation?->id,
                    'product_name' => $shopProduct->product->name,
                    'variation_name' => $variationName,
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'line_total' => round($unitPrice * $quantity, 2),
                    '_variation' => $variation,
                ];
            }

            $orders = [];
            foreach ($linesByShop as $shopId => $lines) {
                $total = array_sum(array_column($lines, 'line_total'));
                $order = Order::create([
                    'reference' => 'ORD-'.strtoupper(Str::random(8)),
                    'customer_id' => $customer->id,
                    'shop_id' => $shopId,
                    'status' => 'pending',
                    'total' => $total,
                ]);

                foreach ($lines as $line) {
                    $variation = $line['_variation'];
                    unset($line['_variation']);
                    $order->items()->create($line);

                    // Decrement stock for variable-product lines.
                    if ($variation instanceof ShopProductVariation) {
                        $variation->decrement('stock', $line['quantity']);
                    }
                }

                $orders[] = $order->load('items', 'shop');
            }

            return $orders;
        });
    }

    /**
     * @return array{0: float, 1: ?string, 2: ?ShopProductVariation}
     */
    private function resolveLine(ShopProduct $shopProduct, ?int $variationId): array
    {
        if ($shopProduct->product->isVariable()) {
            $variation = $shopProduct->variations()
                ->with('productVariation')
                ->where('is_active', true)
                ->find($variationId);

            if (! $variation) {
                throw ValidationException::withMessages(['items' => 'Please choose a valid option for a product in your cart.']);
            }

            return [(float) $variation->price, $variation->productVariation->name, $variation];
        }

        return [(float) $shopProduct->price, null, null];
    }
}
