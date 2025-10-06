export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          type: 'expense' | 'income' | 'estimated_income' | 'estimated_expense';
          is_converted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          type: 'expense' | 'income' | 'estimated_income' | 'estimated_expense';
          is_converted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          type?: 'expense' | 'income' | 'estimated_income' | 'estimated_expense';
          is_converted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}