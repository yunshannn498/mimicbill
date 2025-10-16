/*
  # Add Converted At Timestamp Field

  1. Changes
    - Add `converted_at` column to track when estimated_income was converted to actual income
    
  2. Column Details
    - Type: TIMESTAMPTZ (timestamp with timezone)
    - Nullable: true (only set when conversion happens)
    - Used to determine which month the income should count towards
    
  3. Notes
    - When converting estimated_income to income, this field will be set to current timestamp
    - Monthly income stats will use converted_at instead of created_at for converted transactions
    - Existing transactions will have NULL converted_at (not converted yet)
*/

-- Add converted_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'converted_at'
  ) THEN
    ALTER TABLE transactions 
    ADD COLUMN converted_at TIMESTAMPTZ;
  END IF;
END $$;