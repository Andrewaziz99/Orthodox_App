# Orthodox Application

Website and Flutter clients for the Graphy Bible School platform, plus a CMS-only website content service.

## Architecture

- `../graphy-backend/`: canonical application API on `http://localhost:3000/api/v1`.
- `web/`: Next.js website and management dashboard on `http://localhost:3001`.
- `backend/`: CMS-only NestJS service on `http://localhost:3005`.
- `mobile/orthodox/`: Flutter mobile client.

Graphy owns authentication, users, churches, educational curricula, classes, Bible data, and all management workflows. The CMS owns only site content, news, videos, uploads, and curriculum presentation metadata.

## Local Setup

Install Node dependencies from this directory:

```bash
npm run install:all
```

The Compose service uses PostgreSQL 18 and its `/var/lib/postgresql` volume layout. Do not run it against a volume initialized by the previous `postgres:latest` service: first dump the old database while its original image is running, preserve that volume as a rollback copy, initialize a fresh PostgreSQL 18 volume, restore the dump, and then apply `backend/migration.sql`. PostgreSQL also ignores `POSTGRES_*` changes for initialized volumes, so existing roles and database names must match `backend/.env` until that migration is complete.

For a new database or after completing that dump/restore, start PostgreSQL and apply the schema:

```bash
docker compose up -d db
psql -h localhost -p 5436 -U cms -d orthodox_cms -f backend/migration.sql
```

Create:

- `backend/.env` from `backend/.env.example`.
- `web/.env.local` from `web/.env.example`.
- Graphy's `.env` with real local database, Redis, and JWT values.

Docker Compose accepts `CMS_DATABASE_USER`, `CMS_DATABASE_PASSWORD`,
`CMS_DATABASE_NAME`, and `CMS_DATABASE_PORT`. If you override them, use the
matching `DATABASE_USER`, `DATABASE_PASS`, `DATABASE_NAME`, and `DATABASE_PORT`
values in `backend/.env`.

Start Graphy, CMS, and web together:

```bash
npm run dev
```

Individual commands are available as `npm run dev:graphy`, `npm run dev:cms`, and `npm run dev:web`.

## Verification

```bash
npm run build --prefix ../graphy-backend
npm run build --prefix backend
npm run typecheck --prefix web
npm run build --prefix web
```

For Flutter setup and commands, see `mobile/orthodox/README.md`.
