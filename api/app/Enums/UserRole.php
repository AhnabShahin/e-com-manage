<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case ShopOwner = 'shop_owner';
    case Customer = 'customer';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::ShopOwner => 'Shop Owner',
            self::Customer => 'Customer',
        };
    }
}
