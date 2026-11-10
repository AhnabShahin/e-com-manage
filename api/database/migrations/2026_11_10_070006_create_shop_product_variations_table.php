<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Shop-specific price / stock for a single master variation. A shop may list
     * only a subset of a product's variations.
     */
    public function up(): void
    {
        Schema::create('shop_product_variations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_product_id')->constrained('shop_products')->cascadeOnDelete();
            $table->foreignId('product_variation_id')->constrained('product_variations')->cascadeOnDelete();
            $table->decimal('price', 12, 2);
            $table->unsignedInteger('stock')->default(0);
            $table->string('thumbnail')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['shop_product_id', 'product_variation_id'], 'shop_variation_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_product_variations');
    }
};
