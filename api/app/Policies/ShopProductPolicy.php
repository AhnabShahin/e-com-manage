<?php

namespace App\Policies;

use App\Models\ShopProduct;
use App\Models\User;

class ShopProductPolicy
{
    /** The owner of the parent shop (or an admin) may manage a listing. */
    public function update(User $user, ShopProduct $shopProduct): bool
    {
        return $user->isAdmin() || $shopProduct->shop->owner_id === $user->id;
    }

    public function delete(User $user, ShopProduct $shopProduct): bool
    {
        return $this->update($user, $shopProduct);
    }

    public function view(User $user, ShopProduct $shopProduct): bool
    {
        return $this->update($user, $shopProduct);
    }
}
