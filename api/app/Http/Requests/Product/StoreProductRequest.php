<?php

namespace App\Http\Requests\Product;

use App\Enums\ProductType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Product::class);
    }

    /** Decode JSON-encoded fields sent via multipart/form-data. */
    protected function prepareForValidation(): void
    {
        if (is_string($this->variations)) {
            $this->merge(['variations' => json_decode($this->variations, true) ?? []]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'integer', Rule::exists('categories', 'id')],
            'type' => ['required', new Enum(ProductType::class)],

            // Uploaded images (files, not URLs). Feature image chosen by index.
            'images' => ['array', 'max:8'],
            'images.*' => ['image', 'mimes:jpeg,jpg,png,webp,gif', 'max:4096'],
            'featured_new_index' => ['nullable', 'integer', 'min:0'],

            'variations' => ['array', 'required_if:type,variable'],
            'variations.*.name' => ['required_with:variations', 'string', 'max:255'],
            'variations.*.sku' => ['nullable', 'string', 'max:255'],
            'variations.*.attributes' => ['nullable', 'array'],
        ];
    }
}
