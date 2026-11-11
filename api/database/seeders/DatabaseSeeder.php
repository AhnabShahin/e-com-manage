<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use App\Services\ShopProductService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $service = app(ShopProductService::class);

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

        $carol = User::create([
            'name' => 'Carol (Customer)',
            'email' => 'carol@example.com',
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

        // A shop with no listings — must stay invisible-of-products to customers.
        Shop::create([
            'owner_id' => null,
            'name' => 'Unassigned Shop',
            'slug' => 'unassigned-shop',
            'description' => 'Newly created, no products yet.',
        ]);

        // --- Listings: the same catalog product listed by different shops ----
        // at different prices, proving the shared-catalog model.
        $service->attach($aliceShop, $cable, ['price' => 9.99]);
        $service->attach($aliceShop, $headphones, ['price' => 49.99]);
        $service->attach($aliceShop, $mug, ['price' => 12.50]);
        $service->attach($aliceShop, $tv, [
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

        // Bob lists the SAME cable at a different price + his own catalog.
        $bobCable = $service->attach($bobShop, $cable, ['price' => 8.49]);
        $service->attach($bobShop, $lamp, ['price' => 24.99]);
        $service->attach($bobShop, $desk, ['price' => 159.00]);
        $service->attach($bobShop, $bookshelf, ['price' => 189.00]);
        $service->attach($bobShop, $sofa, [
            'variations' => $sofa->variations->map(fn ($v) => [
                'product_variation_id' => $v->id,
                'price' => str_contains($v->name, '3-Seater') ? 899.00 : 699.00,
                'stock' => 8,
            ])->all(),
        ]);

        // --- A sample customer order -----------------------------------------
        $aliceCable = $aliceShop->shopProducts()->where('product_id', $cable->id)->first();
        app(\App\Services\OrderService::class)->checkout($carol, [
            ['shop_product_id' => $aliceCable->id, 'quantity' => 2],
        ]);
    }

    private function category(string $name): Category
    {
        return Category::create(['name' => $name, 'slug' => Str::slug($name)]);
    }
}
