# Orthodox Website CMS

CMS-only NestJS service for public website content. Graphy remains the canonical backend for authentication, people, churches, educational curricula, Bible data, and application workflows.

## Data Ownership

This service stores only:

- Site section content.
- News articles.
- Website videos.
- Curriculum presentation metadata linked through `graphyCurriculumId`.
- Cloudinary upload results.

It has no local users, login, OTP, church, or educational curriculum model. Protected writes validate the caller's bearer token through Graphy `GET /api/v1/auth/me` and require `super_admin`.

## Setup

```bash
npm install
```

Create `.env` from `.env.example`, then initialize the CMS database:

```bash
psql -h localhost -p 5436 -U cms -d orthodox_cms -f migration.sql
```

The Compose database uses PostgreSQL 18's `/var/lib/postgresql` layout. Before starting it with a volume created by an older PostgreSQL image, dump the old database and restore it into a freshly initialized PostgreSQL 18 volume; reusing the old volume directly can expose an empty cluster.

Existing presentation rows may have a null `graphyCurriculumId`. Backfill each row with its canonical Graphy curriculum UUID.

Existing databases created by the former duplicate backend can remove its obsolete identity tables after backup and Graphy cutover:

```bash
psql -h localhost -p 5436 -U cms -d orthodox_cms -f cleanup-legacy-domain.sql
```

## Commands

```bash
npm run build
npm run start:dev
npm run start:prod
```

The default URL is `http://localhost:3005`.
