<?php

namespace App\Http\Requests\ShopProduct;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShopProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('shopProduct'));
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->variations)) {
            $this->merge(['variations' => json_decode($this->variations, true) ?? []]);
        }
    }

    public function rules(): array
    {
        return [
            'price' => ['nullable', 'numeric', 'min:0'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:4096'],
            'remove_thumbnail' => ['boolean'],
            'details' => ['nullable', 'string'],
            'is_active' => ['boolean'],

            'variations' => ['sometimes', 'array'],
            'variations.*.product_variation_id' => ['required_with:variations', 'integer', Rule::exists('product_variations', 'id')],
            'variations.*.price' => ['required_with:variations', 'numeric', 'min:0'],
            'variations.*.stock' => ['nullable', 'integer', 'min:0'],
            'variations.*.is_active' => ['boolean'],
        ];
    }
}
