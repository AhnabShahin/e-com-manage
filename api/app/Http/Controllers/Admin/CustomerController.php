<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Read-only admin view of customer accounts (customers self-register and self-manage). */
class CustomerController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $customers = User::query()
            ->where('role', UserRole::Customer)
            ->withCount('orders')
            ->when($request->filled('search'), fn ($q) => $q
                ->where(fn ($w) => $w->where('name', 'like', '%'.$request->string('search').'%')
                    ->orWhere('email', 'like', '%'.$request->string('search').'%')))
            ->latest()
            ->paginate($request->integer('per_page', 15))
            ->withQueryString();

        return UserResource::collection($customers);
    }
}
