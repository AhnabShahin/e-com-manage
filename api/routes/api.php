<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ShopController as AdminShopController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Catalog\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Shop\MyShopController;
use App\Http\Controllers\Shop\ShopProductController;
use App\Http\Controllers\Storefront\StorefrontController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public storefront (customer view) — no authentication
|--------------------------------------------------------------------------
*/
Route::prefix('storefront')->group(function () {
    Route::get('shops', [StorefrontController::class, 'shops']);
    Route::get('shops/{shop}', [StorefrontController::class, 'shop']);
    Route::get('shops/{shop}/products', [StorefrontController::class, 'products']);
    Route::get('shops/{shop}/products/{shopProduct}', [StorefrontController::class, 'product']);
});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    /*
    |----------------------------------------------------------------------
    | Customer orders / checkout
    |----------------------------------------------------------------------
    */
    Route::middleware('role:customer')->group(function () {
        Route::get('orders', [OrderController::class, 'index']);
        Route::post('orders', [OrderController::class, 'store']);
    });
    Route::get('orders/{order}', [OrderController::class, 'show']);

    /*
    |----------------------------------------------------------------------
    | Shared catalog + categories (admins and shop owners)
    |----------------------------------------------------------------------
    */
    Route::get('categories', [CategoryController::class, 'index']);
    Route::apiResource('products', ProductController::class);

    /*
    |----------------------------------------------------------------------
    | Shop owner: own shops and their product listings
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin,shop_owner')->group(function () {
        Route::get('my/shops', [MyShopController::class, 'index']);
        Route::get('my/shops/{shop}', [MyShopController::class, 'show']);

        Route::get('shops/{shop}/products', [ShopProductController::class, 'index']);
        Route::post('shops/{shop}/products', [ShopProductController::class, 'store']);

        Route::get('shop-products/{shopProduct}', [ShopProductController::class, 'show']);
        Route::put('shop-products/{shopProduct}', [ShopProductController::class, 'update']);
        Route::patch('shop-products/{shopProduct}', [ShopProductController::class, 'update']);
        Route::delete('shop-products/{shopProduct}', [ShopProductController::class, 'destroy']);

        // Orders placed in the owner's shop.
        Route::get('shops/{shop}/orders', [OrderController::class, 'shopOrders']);
        Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);
    });

    /*
    |----------------------------------------------------------------------
    | Admin only
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::apiResource('shops', AdminShopController::class);
        Route::apiResource('users', UserController::class);
        Route::post('categories', [CategoryController::class, 'store']);
        Route::delete('categories/{category}', [CategoryController::class, 'destroy']);
    });
});
