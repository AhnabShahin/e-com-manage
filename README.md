# ShopHub — Multi-Shop E-commerce Manager

A small e-commerce management system built around a **shared product catalog**. Admins
manage shops, products, and shop-owner accounts; shop owners list catalog products in
their own shops with their own prices and images; customers register, browse, add to
cart, and place orders — seeing only products that are actively listed in a shop.

Highlights: shared catalog with simple & variable products, **image uploads** (multiple
images per product, a chosen feature image, replace/remove with automatic storage
cleanup, uploaded only on save), self-service **auth** for customers and shop owners, a
dynamic **cart**, and **orders** (split per shop) that both customers and shop owners can
track.

Monorepo:

| App     | Stack                         | Dev URL                 |
| ------- | ----------------------------- | ----------------------- |
| `api/`  | Laravel 13 + Sanctum (REST)   | http://localhost:8001   |
| `web/`  | Next.js 16 (App Router) + TS  | http://localhost:3000   |

## The shared-catalog model

```
products                 ← shared/master catalog (admin OR any shop owner creates these)
  └─ product_variations  ← master structure of a variable product (e.g. Red / M)

shops
  └─ shop_products       ← a catalog product listed in a shop  (price for SIMPLE products)
        └─ shop_product_variations  ← per-variation price/stock (for VARIABLE products)
```

- A product created by anyone joins **one shared catalog** and can be listed by any shop.
- The product's **structure** (name, type, which variations exist) is shared.
- The **price / thumbnail / details** are **per shop** — the same product can sell at a
  different price in two different shops.
- **Customers only see `shop_products`** (active, in an active shop). A catalog product
  with no shop listing is never visible to customers.

### Where pagination comes from

| Screen                         | Paginated from         |
| ------------------------------ | ---------------------- |
| Admin catalog / owner browse   | `products`             |
| A shop's own listings          | `shop_products`        |
| Customer storefront            | `shop_products`        |

`shop_product_variations` is never the pagination driver — it is loaded only on a product
detail page (and aggregated as a price range in listings).

## Getting started

### Prerequisites
PHP 8.3+, Composer, Node 20+, and (optionally) MySQL. The API defaults to **SQLite** for
zero-setup local development.

### 1. API (Laravel)

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --port=8001
```

To use MySQL instead of SQLite, create a database and set `DB_CONNECTION=mysql` plus the
`DB_*` values in `.env`, then re-run `php artisan migrate:fresh --seed`.

### 2. Web (Next.js)

```bash
cd web
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8001/api
npm run dev
```

> If the web app runs on a port other than 3000, add that origin to `FRONTEND_URL` in
> `api/.env` (comma-separated) so CORS allows it, then restart the API.

### Demo accounts (password: `password`)

| Role        | Email               |
| ----------- | ------------------- |
| Admin       | admin@example.com   |
| Shop owner  | alice@example.com   |
| Shop owner  | bob@example.com     |
| Customer    | carol@example.com   |

New customers and shop owners can also self-register at `/register`.

### Images & storage

Product/shop images are **uploaded files** (not URLs). Run `php artisan storage:link`
once so uploads under `storage/app/public` are served from `/storage`. Only the relative
path is stored in the DB — the public URL is derived from `APP_URL`, so changing host has
no effect on stored data. Deleting or replacing an image removes the old file from
storage automatically.

## Architecture notes

**Backend**
- **Sanctum** bearer-token auth; `role` on `users` (`admin` / `shop_owner`).
- **Authorization** via Policies (`ProductPolicy`, `ShopPolicy`, `ShopProductPolicy`) and a
  `role` route middleware for coarse gating.
- **Service layer** (`ProductService`, `ShopProductService`) owns the multi-table writes
  (creating a product with variations, listing a product in a shop with per-variation
  prices) inside DB transactions.
- **Form Requests** for validation, **API Resources** for consistent JSON shapes.
- Enums (`UserRole`, `ProductType`) for type-safe domain values.

**Frontend**
- App Router, fully client-rendered and auth-gated (bearer token in `localStorage`).
- Typed API client (`lib/api.ts`), `AuthProvider` context, `RequireAuth` role guard.
- Reusable `ProductForm` (catalog) and `ListingForm` (shop pricing, incl. variations).
- Three areas: public storefront (`/shops`), admin (`/admin`), shop owner (`/dashboard`).

## API overview

```
POST   /api/register                        # customer | shop_owner self-signup
POST   /api/login                           # → { token, user }
GET    /api/me
POST   /api/logout

# Shared catalog (admin + shop owner)
GET    /api/products?search=&shop_id=       # shop_id annotates listed_in_shop
POST   /api/products                        # create catalog product (simple|variable)
GET|PUT|DELETE /api/products/{id}
GET    /api/categories

# Shop owner
GET    /api/my/shops
GET    /api/shops/{shop}/products           # listings in a shop
POST   /api/shops/{shop}/products           # list a catalog product (set price/variations)
GET|PUT|DELETE /api/shop-products/{id}

# Admin
apiResource /api/admin/shops
apiResource /api/admin/users                # shop-owner accounts
POST|DELETE /api/admin/categories

# Public storefront (no auth)
GET    /api/storefront/shops
GET    /api/storefront/shops/{shop}
GET    /api/storefront/shops/{shop}/products
GET    /api/storefront/shops/{shop}/products/{shopProduct}

# Orders
POST   /api/orders                          # customer: checkout (split per shop)
GET    /api/orders                          # customer: order history
GET    /api/orders/{order}
GET    /api/shops/{shop}/orders             # shop owner: orders in a shop
PATCH  /api/orders/{order}/status           # shop owner: pending|completed|cancelled
```

Product create/update accept `multipart/form-data`: `images[]` files, `featured_new_index`
or `featured_image_id` for the feature image, and `removed_image_ids` to delete images
(use `_method=PUT` to spoof the update).
