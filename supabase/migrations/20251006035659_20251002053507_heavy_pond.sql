/*
  # Add estimated_expense type to transactions

  1. Changes
    - Update the type constraint to include 'estimated_expense'
    - This allows transactions to be marked as estimated expenses
    - Estimated expenses will be included in estimated income calculations

  2. Security
    - No changes to RLS policies needed
    - Existing policies will work with the new type
*/

-- Update the constraint to include estimated_expense
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;

ALTER TABLE transactions ADD CONSTRAINT transactions_type_check 
  CHECK (type = ANY (ARRAY['expense'::text, 'income'::text, 'estimated_income'::text, 'estimated_expense'::text]));