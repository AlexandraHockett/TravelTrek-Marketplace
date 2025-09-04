-- ===================================================================
-- 📁 lib/db/migrations/0001_add_password_field.sql
-- Location: CREATE this new migration file
-- ===================================================================

-- Add password field to users table
-- This migration adds the password field for email/password authentication
-- The field is nullable to support OAuth users (Google login)

ALTER TABLE "users" ADD COLUMN "password" text;