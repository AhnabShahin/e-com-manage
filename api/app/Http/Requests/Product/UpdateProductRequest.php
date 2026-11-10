<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('product'));
    }

    /** Decode JSON-encoded fields sent via multipart/form-data. */
    protected function prepareForValidation(): void
    {
        foreach (['variations', 'removed_image_ids'] as $field) {
            if (is_string($this->$field)) {
                $this->merge([$field => json_decode($this->$field, true) ?? []]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'integer', Rule::exists('categories', 'id')],

            // New uploads to add.
            'images' => ['array', 'max:8'],
            'images.*' => ['image', 'mimes:jpeg,jpg,png,webp,gif', 'max:4096'],
            // Existing image ids to remove (files are deleted from storage).
            'removed_image_ids' => ['array'],
            'removed_image_ids.*' => ['integer'],
            // Feature image: either an existing image id or a new upload index.
            'featured_image_id' => ['nullable', 'integer'],
            'featured_new_index' => ['nullable', 'integer', 'min:0'],

            'variations' => ['sometimes', 'array'],
            'variations.*.id' => ['nullable', 'integer'],
            'variations.*.name' => ['required_with:variations', 'string', 'max:255'],
            'variations.*.sku' => ['nullable', 'string', 'max:255'],
            'variations.*.attributes' => ['nullable', 'array'],
        ];
    }
}
