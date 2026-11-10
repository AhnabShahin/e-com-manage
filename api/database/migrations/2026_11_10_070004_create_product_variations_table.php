<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Master-level variations of a variable product (e.g. "Red / M").
     * The structure (which variations exist) is shared across all shops;
     * only price/stock per variation is shop-specific (see shop_product_variations).
     */
    public function up(): void
    {
        Schema::create('product_variations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('name');                 // e.g. "Red / Medium"
            $table->string('sku')->nullable();
            $table->json('attributes')->nullable(); // e.g. {"Color":"Red","Size":"M"}
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variations');
    }
};
