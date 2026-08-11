-- Run only after backing up the former Orthodox backend database and
-- confirming that Graphy owns all identity and church records.
BEGIN;

DROP TABLE IF EXISTS "otp_code";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "church";
DROP TYPE IF EXISTS "user_role_enum";

COMMIT;
