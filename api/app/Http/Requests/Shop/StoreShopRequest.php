<?php

namespace App\Http\Requests\Shop;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreShopRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Shop::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'owner_id' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id')->where('role', UserRole::ShopOwner->value),
            ],
        ];
    }
}
