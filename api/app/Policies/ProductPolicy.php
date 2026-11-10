<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /** Any authenticated user (admin or shop owner) may browse the shared catalog. */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Product $product): bool
    {
        return true;
    }

    /** Admins and shop owners can create catalog products. */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isShopOwner();
    }

    /** Admins manage any product; shop owners may edit products they created. */
    public function update(User $user, Product $product): bool
    {
        return $user->isAdmin() || $product->created_by === $user->id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->isAdmin() || $product->created_by === $user->id;
    }
}
