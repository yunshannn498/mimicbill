/*
  # 创建交易记录表

  1. 新表
    - `transactions`
      - `id` (uuid, 主键)
      - `user_id` (uuid, 外键关联用户)
      - `name` (text, 项目名称)
      - `amount` (numeric, 金额)
      - `type` (text, 交易类型: expense/income/estimated_income)
      - `is_converted` (boolean, 是否已转换)
      - `created_at` (timestamptz, 创建时间)
      - `updated_at` (timestamptz, 更新时间)

  2. 安全设置
    - 启用 RLS (行级安全)
    - 添加策略：用户只能访问自己的交易记录
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  type text NOT NULL CHECK (type IN ('expense', 'income', 'estimated_income')),
  is_converted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 启用行级安全
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的交易记录
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 创建策略：用户只能插入自己的交易记录
CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户只能更新自己的交易记录
CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户只能删除自己的交易记录
CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON transactions(type);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();