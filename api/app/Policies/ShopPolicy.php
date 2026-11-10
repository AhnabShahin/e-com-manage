<?php

namespace App\Policies;

use App\Models\Shop;
use App\Models\User;

class ShopPolicy
{
    /** Shop CRUD is an admin responsibility. */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Shop $shop): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Shop $shop): bool
    {
        return $user->isAdmin();
    }

    /** Admin sees all shops; owner sees their own. */
    public function view(User $user, Shop $shop): bool
    {
        return $user->isAdmin() || $user->ownsShop($shop);
    }

    /** Whether the user may manage product listings inside this shop. */
    public function manageListings(User $user, Shop $shop): bool
    {
        return $user->isAdmin() || $user->ownsShop($shop);
    }
}
