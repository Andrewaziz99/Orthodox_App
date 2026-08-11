-- CMS-only PostgreSQL bootstrap and additive migration.
-- This script intentionally does not create, alter, or drop Graphy-owned tables.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type_enum') THEN
        CREATE TYPE "content_type_enum" AS ENUM ('text', 'textarea', 'image', 'json');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "site_content" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "section" varchar NOT NULL,
  "key" varchar NOT NULL,
  "valueAr" text,
  "valueEn" text,
  "type" "content_type_enum" NOT NULL DEFAULT 'text',
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  UNIQUE ("section", "key")
);

-- These rows contain website presentation metadata only. The canonical
-- educational curriculum remains in Graphy and is referenced by UUID.
CREATE TABLE IF NOT EXISTS "curricula" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "graphyCurriculumId" uuid,
  "slug" varchar UNIQUE NOT NULL,
  "number" varchar NOT NULL,
  "badge" varchar NOT NULL,
  "titleAr" text NOT NULL,
  "titleEn" text NOT NULL,
  "durationAr" text NOT NULL,
  "durationEn" text NOT NULL,
  "audienceAr" text NOT NULL,
  "audienceEn" text NOT NULL,
  "descriptionAr" text NOT NULL,
  "descriptionEn" text NOT NULL,
  "ageRangeAr" text NOT NULL,
  "ageRangeEn" text NOT NULL,
  "fullContentAr" text,
  "fullContentEn" text,
  "order" integer NOT NULL DEFAULT 0,
  "published" boolean NOT NULL DEFAULT true,
  "relatedSlugs" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

-- Existing CMS rows predate Graphy linkage, so the transition stays nullable.
ALTER TABLE "curricula"
  ADD COLUMN IF NOT EXISTS "graphyCurriculumId" uuid;

UPDATE "curricula"
  SET "published" = false
  WHERE "graphyCurriculumId" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_curricula_graphyCurriculumId"
  ON "curricula" ("graphyCurriculumId")
  WHERE "graphyCurriculumId" IS NOT NULL;

CREATE TABLE IF NOT EXISTS "news_articles" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "slug" varchar UNIQUE NOT NULL,
  "titleAr" text NOT NULL,
  "titleEn" text NOT NULL,
  "excerptAr" text NOT NULL,
  "excerptEn" text NOT NULL,
  "bodyAr" text NOT NULL,
  "bodyEn" text NOT NULL,
  "categoryAr" text NOT NULL,
  "categoryEn" text NOT NULL,
  "date" varchar NOT NULL,
  "author" varchar,
  "image" varchar,
  "published" boolean NOT NULL DEFAULT false,
  "order" integer NOT NULL DEFAULT 0,
  "relatedSlugs" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "videos" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "titleAr" varchar NOT NULL,
  "titleEn" varchar NOT NULL,
  "thumbnailUrl" varchar,
  "videoUrl" varchar NOT NULL,
  "isYoutube" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0,
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
