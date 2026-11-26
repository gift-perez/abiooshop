# Deploying abiooshop for free

**Stack:** [Render](https://render.com) free web service (runs the Dockerfile) + [Neon](https://neon.com) free Postgres.
Both are free with no credit card required and use HTTPS by default.

> Render's own free Postgres is deleted after 30 days, so the database lives on Neon instead.

## What "free" means here

| Limitation | Effect on this app |
| --- | --- |
| The Render free service sleeps after 15 min without traffic | The first visit after a quiet period takes about a minute to load. |
| The Render free disk is wiped on every redeploy or restart | Bundled images in `public/uploads` are fine. **Images uploaded from the admin panel are lost** on the next redeploy. Add them to the repo, or move uploads to cloud storage later. |
| The Neon free compute sleeps after 5 min | Adds a short delay to the first query after a quiet period. |
| No background workers | Not needed. Queues run inline and there is no websocket server. |

## 1. Create the database (Neon)

1. Sign up at neon.com and create a project (pick the region closest to your Render region).
2. Copy the **connection string**. It looks like
   `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

## 2. Generate an app key

Run this anywhere PHP and Composer are installed (after `composer install`):

```bash
php artisan key:generate --show
```

Copy the `base64:...` value. Without PHP locally, any 32-byte random value works too:
`base64:` followed by the output of `openssl rand -base64 32`.

## 3. Deploy on Render

1. Push this repo to GitHub.
2. In Render, choose **New → Blueprint** and pick the repo. Render reads `render.yaml`.
3. Fill in the secret values it asks for:

| Variable | Value |
| --- | --- |
| `APP_KEY` | the `base64:...` key from step 2 |
| `APP_URL` | your Render URL, e.g. `https://abiooshop.onrender.com` (you can update it after the first deploy) |
| `DB_URL` | the Neon connection string |
| `ADMIN_EMAIL` | the email you'll log in with as admin |
| `ADMIN_PASSWORD` | a long, unique password |

4. Deploy. On boot, the container caches config, runs migrations, and seeds the admin account and demo products. Seeding is safe to repeat and never duplicates data.
5. Visit `/up` to check health, then log in with your admin email at `/login`. Admins land on `/admin/products`.

## Security checklist

- [x] `APP_DEBUG=false` and `APP_ENV=production` (set in `render.yaml` and the Dockerfile)
- [x] HTTPS everywhere: proxies trusted, URLs forced to https, `SESSION_SECURE_COOKIE=true`, HSTS header
- [x] No credentials in the repo; the admin password comes from env vars
- [x] Admin routes behind `AdminMiddleware`; customers can only see and act on their own orders
- [x] Prices and stock always come from the database, never from the browser
- [x] Payment is a **clearly labelled demo**. No real payment data is collected.
- [ ] After the first successful deploy, consider rotating `ADMIN_PASSWORD` and redeploying

## Running locally

```bash
composer install
npm ci
cp .env.example .env
php artisan key:generate
touch database/database.sqlite      # Windows: type nul > database\database.sqlite
php artisan migrate --seed          # prints a generated admin password if ADMIN_PASSWORD is empty
composer run dev                    # http://localhost:8000
```

If you already had a local database from before this cleanup, run `php artisan migrate:fresh --seed`, because the migrations changed.

## Testing the production image locally (optional)

```bash
docker build -t abiooshop .
docker run --rm -p 8080:8080 --env-file .env.docker abiooshop
```

where `.env.docker` holds the same variables as the Render table above.
