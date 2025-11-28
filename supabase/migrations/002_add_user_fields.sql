-- SQL script to add first_name, last_name, and age columns to waitlist table
-- Compatible with PostgreSQL

-- 1. Add columns (Postgres hỗ trợ IF NOT EXISTS rất tốt)
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS age INTEGER;

-- =============================================
-- OPTIONAL: Constraints (Uncomment to run)
-- =============================================

-- Make first_name and last_name required (NOT NULL)
-- Bước 1: Update dữ liệu cũ để tránh lỗi (quan trọng)
/*
UPDATE waitlist SET first_name = '', last_name = '' 
WHERE first_name IS NULL OR last_name IS NULL;
*/

-- Bước 2: Apply constraint
/*
ALTER TABLE waitlist 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;
*/

-- Add check constraint for age (1 - 150)
/*
ALTER TABLE waitlist
ADD CONSTRAINT age_check CHECK (age >= 1 AND age <= 150);
*/

-- Make age required
/*
UPDATE waitlist SET age = 18 WHERE age IS NULL;

ALTER TABLE waitlist
ALTER COLUMN age SET NOT NULL;
*/