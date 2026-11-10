<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /** The customer who placed it, the owner of its shop, or an admin may view it. */
    public function view(User $user, Order $order): bool
    {
        return $user->isAdmin()
            || $order->customer_id === $user->id
            || $order->shop->owner_id === $user->id;
    }

    /** Only the shop owner (or admin) may change an order's status. */
    public function update(User $user, Order $order): bool
    {
        return $user->isAdmin() || $order->shop->owner_id === $user->id;
    }
}
