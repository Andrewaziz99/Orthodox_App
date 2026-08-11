# Team Onboarding

Read the workspace-level `../AGENTS.md` before making changes. It defines application ownership and verified contracts.

## Services

| Service | URL | Responsibility |
|---|---|---|
| Graphy | `http://localhost:3000/api/v1` | Canonical application API |
| Website | `http://localhost:3001` | Public website and management UI |
| CMS | `http://localhost:3005` | Website content only |
| CMS PostgreSQL | `localhost:5436` | CMS records only |

## Start Locally

The Compose database is PostgreSQL 18. If a CMS volume already exists from the former `postgres:latest` service, do not start the new service yet. Dump the database with its original image, preserve the old volume as a rollback copy, initialize a fresh PostgreSQL 18 volume, restore the dump, and apply `backend/migration.sql`. Existing volumes also retain their original roles and database names regardless of new `POSTGRES_*` values.

```bash
npm run install:all
docker compose up -d db
psql -h localhost -p 5436 -U cms -d orthodox_cms -f backend/migration.sql
npm run dev
```

Configure `backend/.env`, `web/.env.local`, and `../graphy-backend/.env` first. The web environment must point to both Graphy and CMS; the CMS environment must point to Graphy including `/api/v1`.

The CMS dashboard is available at `http://localhost:3001/admin/content` to authenticated Graphy super administrators.
