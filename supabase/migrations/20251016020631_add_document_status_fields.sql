/*
  # Add Document Status Fields to Transactions Table

  1. Changes
    - Add `contract_status` column to track contract completion status
    - Add `third_party_status` column to track third party agreement status
    - Add `invoice_status` column to track invoice completion status
    
  2. Column Details
    - All three columns use TEXT type with CHECK constraints
    - Valid values: 'incomplete', 'not_needed', 'completed'
    - Default value: 'incomplete' for all three fields
    - Used to track document completion for estimated_income transactions
    
  3. Notes
    - These fields are primarily used for estimated_income type transactions
    - Existing records will automatically get 'incomplete' as default value
    - The filter "待完善文件" will show estimated_income items with contract_status='incomplete' OR third_party_status='incomplete'
*/

-- Add contract_status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'contract_status'
  ) THEN
    ALTER TABLE transactions 
    ADD COLUMN contract_status TEXT DEFAULT 'incomplete' 
    CHECK (contract_status IN ('incomplete', 'not_needed', 'completed'));
  END IF;
END $$;

-- Add third_party_status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'third_party_status'
  ) THEN
    ALTER TABLE transactions 
    ADD COLUMN third_party_status TEXT DEFAULT 'incomplete' 
    CHECK (third_party_status IN ('incomplete', 'not_needed', 'completed'));
  END IF;
END $$;

-- Add invoice_status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'invoice_status'
  ) THEN
    ALTER TABLE transactions 
    ADD COLUMN invoice_status TEXT DEFAULT 'incomplete' 
    CHECK (invoice_status IN ('incomplete', 'not_needed', 'completed'));
  END IF;
END $$;