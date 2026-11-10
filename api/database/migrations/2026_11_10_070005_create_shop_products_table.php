<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A catalog product listed inside a specific shop. This is what makes a
     * product visible to customers. Shop owners set their own price / thumbnail /
     * details here. For simple products the price lives on this row; for variable
     * products the price lives per-variation (see shop_product_variations).
     */
    public function up(): void
    {
        Schema::create('shop_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->decimal('price', 12, 2)->nullable(); // used for simple products
            $table->string('thumbnail')->nullable();      // shop-specific image override
            $table->text('details')->nullable();          // shop-specific description override
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['shop_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_products');
    }
};
