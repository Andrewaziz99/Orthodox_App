-- Orthodox App Database Migration
-- Comprehensive Schema for PostgreSQL

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Custom Enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE "user_role_enum" AS ENUM ('super_admin', 'church_admin', 'servant', 'child');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type_enum') THEN
        CREATE TYPE "content_type_enum" AS ENUM ('text', 'textarea', 'image', 'json');
    END IF;
END $$;

-- 3. Create Tables

-- Churches Table
CREATE TABLE IF NOT EXISTS "church" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar NOT NULL,
  "status" varchar NOT NULL DEFAULT 'pending',
  "maxChildren" integer NOT NULL DEFAULT 0,
  "location" varchar,
  "address" varchar,
  "phone" varchar,
  "email" varchar,
  "subscriptionStartDate" timestamp
);

-- Users Table
CREATE TABLE IF NOT EXISTS "user" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar NOT NULL,
  "phone" varchar UNIQUE,
  "email" varchar UNIQUE,
  "role" "user_role_enum" NOT NULL,
  "passwordHash" varchar,
  "status" varchar NOT NULL DEFAULT 'pending',
  "churchId" uuid REFERENCES "church"("id") ON DELETE SET NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

-- OTP Codes Table
CREATE TABLE IF NOT EXISTS "otp_code" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "phone" varchar NOT NULL,
  "code" varchar NOT NULL,
  "expiresAt" timestamp NOT NULL,
  "used" boolean NOT NULL DEFAULT false
);

-- Site Content Table (CMS)
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

-- Curricula Table
CREATE TABLE IF NOT EXISTS "curricula" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  "relatedSlugs" text, -- Stored as comma-separated values
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

-- News Articles Table
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
  "relatedSlugs" text, -- Stored as comma-separated values
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

-- Video Gallery Table
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
