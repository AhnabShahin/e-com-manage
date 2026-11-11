# ShopHub by CSN Bangladesh Ltd. — Multi-Shop E-commerce Manager

A small e-commerce management system built around a **shared product catalog**. Admins
manage shops, products, and shop-owner accounts; shop owners list catalog products in
their own shops with their own prices and images; customers register, browse, add to
cart, and place orders — seeing only products that are actively listed in a shop.

Highlights: shared catalog with simple & variable products, **image uploads**, self-service
**auth** for customers and shop owners, a dynamic **cart**, and **orders** (split per shop)
that both customers and shop owners can track.

Monorepo:

| Folder  | Stack                         | Runs at                 |
| ------- | ------------------------------ | ----------------------- |
| `api/`  | Laravel 13 (PHP) + Sanctum REST| http://localhost:8000   |
| `web/`  | Next.js 16 (React + TypeScript)| http://localhost:3000   |
| DB      | MySQL                          | `ecom_manage`            |

This README is written so the project can be set up **from a fresh `git clone`**, either
with command-line tools or with a local server stack like **WAMP** / **XAMPP** and
**phpMyAdmin**. Follow the sections in order.

---

## 0. What you need installed

- **PHP 8.3+** and **Composer** — already included if you use WAMP or XAMPP.
- **MySQL** — already included in WAMP/XAMPP.
- **Node.js 20+** and **npm** (for the `web/` frontend) — install separately from
  [nodejs.org](https://nodejs.org) if you don't have it.
- **Git**.

If you're using WAMP or XAMPP, start it now and make sure **Apache** and **MySQL** are
both running (green icons in WAMP, or "Start" next to Apache/MySQL in the XAMPP
Control Panel).

---

## 1. Clone the repository

```bash
git clone <this-repository-url>
cd e-com-manage
```

The project has two folders: `api/` (Laravel backend) and `web/` (Next.js frontend).
Everything below is run from inside one or the other — the commands always say which.

---

## 2. Create the database and load the data

You have two options. **Option A is the fastest** — it loads the app with full demo data
(shops, products, orders, customers) in one click via phpMyAdmin. **Option B** builds the
same schema from Laravel's migrations and seeder instead, which is the normal developer
workflow.

### Option A — Import the ready-made `ecom_manage.sql` (phpMyAdmin / WAMP / XAMPP)

1. Open **phpMyAdmin** in your browser:
   - WAMP: click the WAMP tray icon → **phpMyAdmin**, or go to `http://localhost/phpmyadmin`.
   - XAMPP: open the XAMPP Control Panel → **Admin** next to MySQL, or go to
     `http://localhost/phpmyadmin`.
2. Click **Databases** (top menu) and create a new database named exactly:
   ```
   ecom_manage
   ```
   Leave the collation as `utf8mb4_unicode_ci` (or the default) and click **Create**.
3. In the left sidebar, click on the new **ecom_manage** database to open it.
4. Click the **Import** tab (top menu, inside the database).
5. Click **Choose File** and select **`ecom_manage.sql`** from the root of this
   repository (the file you just cloned — it sits next to this README).
6. Scroll down and click **Go** (or **Import**).

That's it — phpMyAdmin will show a success message and the database now has every
table, already filled with demo users, shops, catalog products (with images), and
sample orders. **Skip the `migrate` / `seed` commands below** — go straight to
[step 3 (backend setup)](#3-backend-setup-api).

> The dump only contains `CREATE TABLE` / `INSERT` statements (no `CREATE DATABASE`), so
> it imports cleanly into the empty `ecom_manage` database you just created. Every table
> is created as InnoDB, so this works even if your MySQL server's default storage engine
> is MyISAM (see [Troubleshooting](#troubleshooting) if you hit a "key too long" error
> some other way).

### Option B — Build the database from Laravel's migrations + seeder

If you'd rather generate the data from code instead of importing a dump, still create an
empty **`ecom_manage`** database (step 2 above), but skip the Import tab. Then, in
[step 3](#3-backend-setup-api) below, run `php artisan migrate:fresh --seed` instead of
skipping it — that creates every table and inserts the exact same demo dataset.

---

## 3. Backend setup (`api/`)

```bash
cd api
composer install
```

Create the environment file:

```bash
cp .env.example .env        # macOS/Linux
copy .env.example .env      # Windows (cmd)
```
```powershell
Copy-Item .env.example .env # Windows (PowerShell)
```

Open `api/.env` and set the database connection to MySQL:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecom_manage
DB_USERNAME=root
DB_PASSWORD=
```

> WAMP/XAMPP's default MySQL `root` user normally has **no password** — leave
> `DB_PASSWORD` empty unless you changed it yourself. If your MySQL runs on a different
> port, update `DB_PORT` to match.

Generate the application key (required — Laravel won't run without it):

```bash
php artisan key:generate
```

Now, depending on which option you picked in step 2:

- **If you imported `ecom_manage.sql` (Option A):** the database already has all the
  tables and data — **skip this command**.
- **If you created an empty database (Option B):** build the schema and demo data now:
  ```bash
  php artisan migrate:fresh --seed
  ```

Either way, run this once so uploaded/seeded product images are served correctly:

```bash
php artisan storage:link
```

Start the API:

```bash
php artisan serve --port=8000
```

The API is now running at **http://localhost:8000**. Leave this terminal open.

---

## 4. Frontend setup (`web/`)

Open a **second terminal** (keep the API running in the first one):

```bash
cd web
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env.local        # macOS/Linux
copy .env.example .env.local      # Windows (cmd)
```

Start the dev server:

```bash
npm run dev
```

The app is now running at **http://localhost:3000**.

> If port 3000 is already in use, Next.js will automatically pick another port (e.g.
> 3001) and print it in the terminal. If that happens, open `api/.env`, add that origin
> to `FRONTEND_URL` (comma-separated, e.g.
> `FRONTEND_URL=http://localhost:3000,http://localhost:3001`), then stop and restart
> `php artisan serve` so the API accepts requests from it (CORS).

---

## 5. Try it out

Open **http://localhost:3000** in your browser.

- **Storefront** (no login needed): `http://localhost:3000/shops` — browse 4 shops and 9
  products across Electronics, Furniture, and Home & Living.
- **Sign in**: `http://localhost:3000/login` — use any demo account below (password for
  all of them is `password`), or click one of the quick-login buttons on the page.

### Demo accounts (password: `password`)

| Role        | Name            | Email                |
| ----------- | ---------------- | -------------------- |
| Admin       | Admin             | admin@example.com    |
| Shop owner  | Alice (Owner)     | alice@example.com    |
| Shop owner  | Bob (Owner)       | bob@example.com      |
| Shop owner  | Grace (Owner)     | grace@example.com    |
| Shop owner  | Henry (Owner)     | henry@example.com    |
| Customer    | Carol (Customer)  | carol@example.com    |
| Customer    | Dave (Customer)   | dave@example.com     |
| Customer    | Emma (Customer)   | emma@example.com     |
| Customer    | Farhan (Customer) | farhan@example.com   |

New customers and shop owners can also self-register at `/register`.

- **Admin panel**: log in as `admin@example.com` → `http://localhost:3000/admin`
  (dashboard, shops, catalog, staff accounts, customers, categories).
- **Shop owner dashboard**: log in as e.g. `alice@example.com` →
  `http://localhost:3000/dashboard` (your shops, shared catalog, orders).

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Specified key was too long; max key length is 1000 bytes` while importing/migrating | Your MySQL server's default table engine is MyISAM instead of InnoDB. This repo already forces `InnoDB` for the `mysql` connection in `api/config/database.php` (`'engine' => 'InnoDB'`), so this shouldn't happen via `migrate`. If you hit it anyway, confirm that line wasn't changed, or create the database with InnoDB explicitly and re-import. |
| Product images show as broken / "No image" | Run `php artisan storage:link` inside `api/`, then refresh. |
| Browser shows a CORS error / "Failed to fetch" when logging in | The web app's port isn't in `FRONTEND_URL` in `api/.env`. Add it (comma-separated) and restart `php artisan serve`. |
| `SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'` | Your MySQL root password isn't empty. Set `DB_PASSWORD` in `api/.env` to match, or reset it via phpMyAdmin → User accounts. |
| `php artisan key:generate` errors or app shows "No application encryption key" | Make sure `api/.env` exists (copied from `.env.example`) before running the command. |
| Port 8000 or 3000 already in use | Pass a different port, e.g. `php artisan serve --port=8002`, and update `NEXT_PUBLIC_API_URL` in `web/.env.local` to match; or stop whatever is already using that port. |

---

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
- **Customers only ever see `shop_products`** (active, in an active shop, via the
  `/api/storefront/...` endpoints). A catalog product with no shop listing is never
  visible to customers, and the raw `/api/products` catalog endpoint itself is restricted
  to admins and shop owners only.

### Where pagination comes from

| Screen                         | Paginated from         |
| ------------------------------ | ---------------------- |
| Admin catalog / owner browse   | `products`             |
| A shop's own listings          | `shop_products`        |
| Customer storefront            | `shop_products`        |

`shop_product_variations` is never the pagination driver — it is loaded only on a product
detail page (and aggregated as a price range in listings).

## Architecture notes

**Backend**
- **Sanctum** bearer-token auth; `role` on `users` (`admin` / `shop_owner` / `customer`).
- **Authorization** via Policies (`ProductPolicy`, `ShopPolicy`, `ShopProductPolicy`,
  `OrderPolicy`) and a `role` route middleware for coarse gating.
- **Service layer** (`ProductService`, `ShopProductService`, `OrderService`) owns the
  multi-table writes (creating a product with variations, listing a product in a shop
  with per-variation prices, splitting a checkout into one order per shop) inside DB
  transactions.
- **Form Requests** for validation, **API Resources** for consistent JSON shapes.
- Enums (`UserRole`, `ProductType`) for type-safe domain values.
- Deleting a shared catalog product is blocked for non-admins while it's still listed in
  any shop, to protect other shops' active listings.

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

# Shared catalog (admin + shop owner only — never exposed to customers)
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
apiResource /api/admin/users                # staff (admin / shop-owner) accounts
GET    /api/admin/customers                 # read-only customer list + activate/deactivate
POST|DELETE /api/admin/categories

# Public storefront (no auth) — the only thing customers ever read from
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

## Images & storage

Product/shop images live on the `public` disk under `storage/app/public` and are
committed to this repository (seeded demo images included), so a fresh clone has working
images without needing internet access. Run `php artisan storage:link` once so they're
served at `/storage/...`. Only the relative path is stored in the DB — the public URL is
derived from `APP_URL`, so changing host has no effect on stored data.
