# ShopHub by CSN Bangladesh Ltd. — Multi-Shop E-commerce Manager

Shared product catalog: admins manage shops/products/accounts, shop owners list catalog
products in their own shops with their own prices, customers see only listed products.

- **Backend**: `api/` — Laravel 13 (PHP) → `http://localhost:8000`
- **Frontend**: `web/` — Next.js 16 (React + TS) → `http://localhost:3000`
- **Database**: MySQL, name it `ecom_manage`

## Prerequisites

PHP 8.3+, Composer, MySQL (all included in WAMP/XAMPP), Node.js 20+, Git.

## 1. Clone

```bash
git clone <this-repository-url>
cd e-com-manage
```

## 2. Database

**Option A — import the ready-made dump (fastest, has demo data):**

1. Start Apache + MySQL in WAMP/XAMPP.
2. Open phpMyAdmin → `http://localhost/phpmyadmin`.
3. **Databases** tab → create database named `ecom_manage`.
4. Click **ecom_manage** → **Import** tab.
5. Choose file **`ecom_manage.sql`** (repo root) → **Go**.

**Option B — build it with Laravel instead:** just create the empty `ecom_manage`
database and skip Import; run `migrate:fresh --seed` in step 3 instead.

## 3. Backend (`api/`)

```bash
cd api
composer install
cp .env.example .env            # Windows: copy .env.example .env
php artisan key:generate
```

Edit `api/.env`:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecom_manage
DB_USERNAME=root
DB_PASSWORD=
```

- Imported the SQL dump (Option A)? **Skip this.**
- Empty database (Option B)? Run:
  ```bash
  php artisan migrate:fresh --seed
  ```

Then, either way:

```bash
php artisan storage:link
php artisan serve --port=8000
```

API running at **http://localhost:8000**.

## 4. Frontend (`web/`)

```bash
cd web
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
npm run dev
```

App running at **http://localhost:3000**.

> If Next.js picks a different port (e.g. 3001), add it to `FRONTEND_URL` in `api/.env`
> (comma-separated), then restart `php artisan serve`.

## 5. Demo accounts (password: `password`)

| Role       | Email                |
| ---------- | -------------------- |
| Admin      | admin@example.com    |
| Shop owner | alice@example.com, bob@example.com, grace@example.com, henry@example.com |
| Customer   | carol@example.com, dave@example.com, emma@example.com, farhan@example.com |

Admin panel: `/admin` · Shop owner dashboard: `/dashboard` · Storefront: `/shops`

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `key too long; max 1000 bytes` on import/migrate | MySQL defaulted to MyISAM. Tables are forced to InnoDB in `api/config/database.php` — if it still happens, re-check that setting. |
| Broken product images | Run `php artisan storage:link`. |
| CORS / "Failed to fetch" on login | Add the web app's port to `FRONTEND_URL` in `api/.env`, restart API. |
| MySQL access denied | Set `DB_PASSWORD` in `api/.env` to your actual root password. |
| Port already in use | `php artisan serve --port=8002` (or any free port) and match it in `web/.env.local`. |

## Notes

- Product images are committed to the repo (`api/storage/app/public/products`), so they
  work offline after a fresh clone — no external image hosting needed.
- Customers only ever read `/api/storefront/...`; the raw catalog (`/api/products`) is
  admin/shop-owner only, so unlisted products are never visible to customers.
- Full API route list and architecture notes: see code comments in `api/routes/api.php`
  and the Policies/Services under `api/app/`.
