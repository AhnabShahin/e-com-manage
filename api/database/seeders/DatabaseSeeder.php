<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use App\Services\OrderService;
use App\Services\ShopProductService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $service = app(ShopProductService::class);
        $orders = app(OrderService::class);

        // --- Users -----------------------------------------------------------
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => UserRole::Admin,
        ]);

        $alice = User::create([
            'name' => 'Alice (Owner)',
            'email' => 'alice@example.com',
            'password' => 'password',
            'role' => UserRole::ShopOwner,
        ]);

        $bob = User::create([
            'name' => 'Bob (Owner)',
            'email' => 'bob@example.com',
            'password' => 'password',
            'role' => UserRole::ShopOwner,
        ]);

        $grace = User::create([
            'name' => 'Grace (Owner)',
            'email' => 'grace@example.com',
            'password' => 'password',
            'role' => UserRole::ShopOwner,
        ]);

        $henry = User::create([
            'name' => 'Henry (Owner)',
            'email' => 'henry@example.com',
            'password' => 'password',
            'role' => UserRole::ShopOwner,
        ]);

        $carol = User::create([
            'name' => 'Carol (Customer)',
            'email' => 'carol@example.com',
            'password' => 'password',
            'role' => UserRole::Customer,
        ]);

        $dave = User::create([
            'name' => 'Dave (Customer)',
            'email' => 'dave@example.com',
            'password' => 'password',
            'role' => UserRole::Customer,
        ]);

        $emma = User::create([
            'name' => 'Emma (Customer)',
            'email' => 'emma@example.com',
            'password' => 'password',
            'role' => UserRole::Customer,
        ]);

        $farhan = User::create([
            'name' => 'Farhan (Customer)',
            'email' => 'farhan@example.com',
            'password' => 'password',
            'role' => UserRole::Customer,
        ]);

        // --- Categories ------------------------------------------------------
        $electronics = $this->category('Electronics');
        $furniture = $this->category('Furniture');
        $home = $this->category('Home & Living');

        // --- Shared catalog products (electronics, furniture & home) --------
        // Images ship locally from storage/app/public/products — committed to
        // git so a fresh clone + migrate + seed has working thumbnails offline.

        // Simple product created by the admin.
        $cable = Product::create([
            'created_by' => $admin->id,
            'category_id' => $electronics->id,
            'name' => 'USB-C Charging Cable',
            'slug' => 'usb-c-charging-cable',
            'description' => 'Durable 1m braided USB-C cable, 60W fast charging.',
            'type' => ProductType::Simple,
            'thumbnail' => 'products/usb-c-charging-cable.svg',
        ]);

        $headphones = Product::create([
            'created_by' => $admin->id,
            'category_id' => $electronics->id,
            'name' => 'Wireless Bluetooth Headphones',
            'slug' => 'wireless-bluetooth-headphones',
            'description' => 'Over-ear Bluetooth 5.3 headphones with 30h battery life.',
            'type' => ProductType::Simple,
            'thumbnail' => 'products/wireless-bluetooth-headphones.svg',
        ]);

        // Variable product (screen size) created by the admin.
        $tv = Product::create([
            'created_by' => $admin->id,
            'category_id' => $electronics->id,
            'name' => 'Smart LED TV',
            'slug' => 'smart-led-tv',
            'description' => '4K HDR smart TV with built-in streaming apps.',
            'type' => ProductType::Variable,
            'thumbnail' => 'products/smart-led-tv.svg',
        ]);
        foreach (['43-inch', '55-inch', '65-inch'] as $size) {
            $tv->variations()->create([
                'name' => $size,
                'sku' => 'TV-'.strtoupper(str_replace('-inch', '', $size)),
                'attributes' => ['Size' => $size],
            ]);
        }

        $bookshelf = Product::create([
            'created_by' => $admin->id,
            'category_id' => $furniture->id,
            'name' => 'Five-Tier Bookshelf',
            'slug' => 'five-tier-bookshelf',
            'description' => 'Solid-frame open bookshelf with five storage tiers.',
            'type' => ProductType::Simple,
            'thumbnail' => 'products/five-tier-bookshelf.svg',
        ]);

        // Simple product created by a shop owner (available to everyone).
        $mug = Product::create([
            'created_by' => $alice->id,
            'category_id' => $home->id,
            'name' => 'Ceramic Coffee Mug',
            'slug' => 'ceramic-coffee-mug',
            'description' => '350ml matte ceramic mug.',
            'type' => ProductType::Simple,
            'thumbnail' => 'products/ceramic-coffee-mug.svg',
        ]);

        $lamp = Product::create([
            'created_by' => $alice->id,
            'category_id' => $electronics->id,
            'name' => 'LED Desk Lamp',
            'slug' => 'led-desk-lamp',
            'description' => 'Dimmable LED desk lamp with adjustable arm.',
            'type' => ProductType::Simple,
            'thumbnail' => 'products/led-desk-lamp.svg',
        ]);

        // Variable product (color) created by a shop owner.
        $chair = Product::create([
            'created_by' => $alice->id,
            'category_id' => $furniture->id,
            'name' => 'Ergonomic Office Chair',
            'slug' => 'ergonomic-office-chair',
            'description' => 'Mesh-back office chair with lumbar support and armrests.',
            'type' => ProductType::Variable,
            'thumbnail' => 'products/ergonomic-office-chair.svg',
        ]);
        foreach (['Black', 'Grey'] as $color) {
            $chair->variations()->create([
                'name' => $color,
                'sku' => 'OC-'.strtoupper(substr($color, 0, 3)),
                'attributes' => ['Color' => $color],
            ]);
        }

        $desk = Product::create([
            'created_by' => $bob->id,
            'category_id' => $furniture->id,
            'name' => 'Wooden Study Desk',
            'slug' => 'wooden-study-desk',
            'description' => 'Compact study desk with a single storage drawer.',
            'type' => ProductType::Simple,
            'thumbnail' => 'products/wooden-study-desk.svg',
        ]);

        // Variable product (color x size) created by a shop owner.
        $sofa = Product::create([
            'created_by' => $bob->id,
            'category_id' => $furniture->id,
            'name' => 'Modular Fabric Sofa',
            'slug' => 'modular-fabric-sofa',
            'description' => 'Modular fabric sofa, available in two colors and sizes.',
            'type' => ProductType::Variable,
            'thumbnail' => 'products/modular-fabric-sofa.svg',
        ]);
        foreach (['Charcoal', 'Sand'] as $color) {
            foreach (['2-Seater', '3-Seater'] as $size) {
                $sofa->variations()->create([
                    'name' => "{$color} / {$size}",
                    'sku' => 'SF-'.strtoupper(substr($color, 0, 3)).'-'.Str::slug($size),
                    'attributes' => ['Color' => $color, 'Size' => $size],
                ]);
            }
        }

        // --- Shops (admin-managed) ------------------------------------------
        $aliceShop = Shop::create([
            'owner_id' => $alice->id,
            'name' => "Alice's Gadgets",
            'slug' => 'alices-gadgets',
            'description' => 'Everyday electronics and smart home accessories.',
        ]);

        $bobShop = Shop::create([
            'owner_id' => $bob->id,
            'name' => "Bob's Lifestyle",
            'slug' => 'bobs-lifestyle',
            'description' => 'Furniture and home essentials.',
        ]);

        $graceShop = Shop::create([
            'owner_id' => $grace->id,
            'name' => "Grace's Home Store",
            'slug' => 'graces-home-store',
            'description' => 'Furniture and home decor for every room.',
        ]);

        $henryShop = Shop::create([
            'owner_id' => $henry->id,
            'name' => "Henry's Electronics",
            'slug' => 'henrys-electronics',
            'description' => 'Budget-friendly electronics and gadgets.',
        ]);

        // A shop with no listings — must stay invisible-of-products to customers.
        Shop::create([
            'owner_id' => null,
            'name' => 'Unassigned Shop',
            'slug' => 'unassigned-shop',
            'description' => 'Newly created, no products yet.',
        ]);

        // --- Listings: the same catalog product listed by several shops ------
        // at different prices, proving the shared-catalog model.
        $aliceCable = $service->attach($aliceShop, $cable, ['price' => 9.99]);
        $service->attach($aliceShop, $headphones, ['price' => 49.99]);
        $service->attach($aliceShop, $mug, ['price' => 12.50]);
        $aliceTv = $service->attach($aliceShop, $tv, [
            'variations' => $tv->variations->map(fn ($v) => [
                'product_variation_id' => $v->id,
                'price' => match ($v->name) {
                    '43-inch' => 320.00,
                    '55-inch' => 480.00,
                    default => 650.00,
                },
                'stock' => 10,
            ])->all(),
        ]);
        $service->attach($aliceShop, $chair, [
            'variations' => $chair->variations->map(fn ($v) => [
                'product_variation_id' => $v->id,
                'price' => 139.00,
                'stock' => 20,
            ])->all(),
        ]);

        $service->attach($bobShop, $cable, ['price' => 8.49]);
        $service->attach($bobShop, $lamp, ['price' => 24.99]);
        $bobDesk = $service->attach($bobShop, $desk, ['price' => 159.00]);
        $service->attach($bobShop, $bookshelf, ['price' => 189.00]);
        $bobSofa = $service->attach($bobShop, $sofa, [
            'variations' => $sofa->variations->map(fn ($v) => [
                'product_variation_id' => $v->id,
                'price' => str_contains($v->name, '3-Seater') ? 899.00 : 699.00,
                'stock' => 8,
            ])->all(),
        ]);

        $graceDesk = $service->attach($graceShop, $desk, ['price' => 179.00]);
        $graceSofa = $service->attach($graceShop, $sofa, [
            'variations' => $sofa->variations->map(fn ($v) => [
                'product_variation_id' => $v->id,
                'price' => str_contains($v->name, '3-Seater') ? 949.00 : 749.00,
                'stock' => 6,
            ])->all(),
        ]);
        $service->attach($graceShop, $bookshelf, ['price' => 209.00]);
        $graceChair = $service->attach($graceShop, $chair, [
            'variations' => $chair->variations->map(fn ($v) => [
                'product_variation_id' => $v->id,
                'price' => 149.00,
                'stock' => 15,
            ])->all(),
        ]);
        $service->attach($graceShop, $mug, ['price' => 14.00]);

        $henryCable = $service->attach($henryShop, $cable, ['price' => 7.99]);
        $service->attach($henryShop, $headphones, ['price' => 44.99]);
        $henryTv = $service->attach($henryShop, $tv, [
            'variations' => $tv->variations->map(fn ($v) => [
                'product_variation_id' => $v->id,
                'price' => match ($v->name) {
                    '43-inch' => 299.00,
                    '55-inch' => 459.00,
                    default => 599.00,
                },
                'stock' => 7,
            ])->all(),
        ]);
        $service->attach($henryShop, $lamp, ['price' => 21.99]);

        // --- Sample customer orders, spread across shops with mixed statuses -
        $findVariation = fn ($shopProduct, string $name) => $shopProduct->variations
            ->first(fn ($v) => $v->productVariation->name === $name);

        $order1 = $orders->checkout($carol, [
            ['shop_product_id' => $aliceCable->id, 'quantity' => 2],
        ])[0];

        $order2 = $orders->checkout($carol, [
            [
                'shop_product_id' => $bobSofa->id,
                'shop_product_variation_id' => $findVariation($bobSofa, 'Charcoal / 2-Seater')->id,
                'quantity' => 1,
            ],
        ])[0];

        $order3 = $orders->checkout($dave, [
            [
                'shop_product_id' => $henryTv->id,
                'shop_product_variation_id' => $findVariation($henryTv, '55-inch')->id,
                'quantity' => 1,
            ],
        ])[0];

        $order4 = $orders->checkout($dave, [
            ['shop_product_id' => $graceDesk->id, 'quantity' => 1],
        ])[0];

        $order5 = $orders->checkout($emma, [
            ['shop_product_id' => $aliceShop->shopProducts()->where('product_id', $headphones->id)->first()->id, 'quantity' => 2],
        ])[0];

        $order6 = $orders->checkout($emma, [
            [
                'shop_product_id' => $graceChair->id,
                'shop_product_variation_id' => $findVariation($graceChair, 'Black')->id,
                'quantity' => 1,
            ],
        ])[0];

        $order7 = $orders->checkout($farhan, [
            ['shop_product_id' => $bobShop->shopProducts()->where('product_id', $lamp->id)->first()->id, 'quantity' => 3],
        ])[0];

        $order8 = $orders->checkout($farhan, [
            ['shop_product_id' => $henryCable->id, 'quantity' => 1],
        ])[0];

        // Mix order statuses so admin/shop dashboards have something to show.
        foreach ([$order1, $order3, $order6, $order8] as $order) {
            $order->update(['status' => 'completed']);
        }
        $order5->update(['status' => 'cancelled']);
        // $order2, $order4, $order7 stay 'pending'.
    }

    private function category(string $name): Category
    {
        return Category::create(['name' => $name, 'slug' => Str::slug($name)]);
    }
}
