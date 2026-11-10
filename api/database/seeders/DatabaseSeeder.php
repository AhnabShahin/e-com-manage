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
        $apparel = $this->category('Apparel');
        $home = $this->category('Home & Living');

        // --- Shared catalog products ----------------------------------------
        // Simple product created by the admin.
        $cable = Product::create([
            'created_by' => $admin->id,
            'category_id' => $electronics->id,
            'name' => 'USB-C Charging Cable',
            'slug' => 'usb-c-charging-cable',
            'description' => 'Durable 1m braided USB-C cable.',
            'type' => ProductType::Simple,
            'thumbnail' => 'https://picsum.photos/seed/cable/600/600',
        ]);

        // Simple product created by a shop owner (available to everyone).
        $mug = Product::create([
            'created_by' => $alice->id,
            'category_id' => $home->id,
            'name' => 'Ceramic Coffee Mug',
            'slug' => 'ceramic-coffee-mug',
            'description' => '350ml matte ceramic mug.',
            'type' => ProductType::Simple,
            'thumbnail' => 'https://picsum.photos/seed/mug/600/600',
        ]);

        // Variable product (color x size) created by the admin.
        $tshirt = Product::create([
            'created_by' => $admin->id,
            'category_id' => $apparel->id,
            'name' => 'Classic Cotton T-Shirt',
            'slug' => 'classic-cotton-t-shirt',
            'description' => '100% combed cotton crew-neck tee.',
            'type' => ProductType::Variable,
            'thumbnail' => 'https://picsum.photos/seed/tshirt/600/600',
        ]);

        foreach (['Red', 'Blue'] as $color) {
            foreach (['S', 'M', 'L'] as $size) {
                $tshirt->variations()->create([
                    'name' => "{$color} / {$size}",
                    'sku' => 'TS-'.strtoupper(substr($color, 0, 1))."-{$size}",
                    'attributes' => ['Color' => $color, 'Size' => $size],
                ]);
            }
        }

        // Variable product created by a shop owner.
        $bottle = Product::create([
            'created_by' => $bob->id,
            'category_id' => $home->id,
            'name' => 'Insulated Water Bottle',
            'slug' => 'insulated-water-bottle',
            'description' => 'Stainless steel vacuum flask.',
            'type' => ProductType::Variable,
            'thumbnail' => 'https://picsum.photos/seed/bottle/600/600',
        ]);
        foreach (['500ml', '750ml', '1L'] as $capacity) {
            $bottle->variations()->create([
                'name' => $capacity,
                'sku' => 'WB-'.Str::slug($capacity),
                'attributes' => ['Capacity' => $capacity],
            ]);
        }

        // --- Shops (admin-managed) ------------------------------------------
        $aliceShop = Shop::create([
            'owner_id' => $alice->id,
            'name' => "Alice's Gadgets",
            'slug' => 'alices-gadgets',
            'description' => 'Everyday electronics and accessories.',
        ]);

        $bobShop = Shop::create([
            'owner_id' => $bob->id,
            'name' => "Bob's Lifestyle",
            'slug' => 'bobs-lifestyle',
            'description' => 'Apparel and home essentials.',
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
        $service->attach($aliceShop, $mug, ['price' => 12.50]);
        $service->attach($aliceShop, $tshirt, [
            'variations' => $tshirt->variations->map(fn ($v) => [
                'product_variation_id' => $v->id,
                'price' => str_contains($v->name, 'L') ? 18.00 : 15.00,
                'stock' => 25,
            ])->all(),
        ]);

        // Bob lists the SAME cable at a different price + the bottle he created.
        $bobCable = $service->attach($bobShop, $cable, ['price' => 8.49]);
        $service->attach($bobShop, $bottle, [
            'variations' => $bottle->variations->map(fn ($v) => [
                'product_variation_id' => $v->id,
                'price' => match ($v->name) {
                    '500ml' => 19.00,
                    '750ml' => 22.00,
                    default => 26.00,
                },
                'stock' => 15,
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
