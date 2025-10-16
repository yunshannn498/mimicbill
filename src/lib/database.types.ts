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
          converted_at: string | null;
          contract_status: 'incomplete' | 'not_needed' | 'completed';
          third_party_status: 'incomplete' | 'not_needed' | 'completed';
          invoice_status: 'incomplete' | 'not_needed' | 'completed';
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
          converted_at?: string | null;
          contract_status?: 'incomplete' | 'not_needed' | 'completed';
          third_party_status?: 'incomplete' | 'not_needed' | 'completed';
          invoice_status?: 'incomplete' | 'not_needed' | 'completed';
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
          converted_at?: string | null;
          contract_status?: 'incomplete' | 'not_needed' | 'completed';
          third_party_status?: 'incomplete' | 'not_needed' | 'completed';
          invoice_status?: 'incomplete' | 'not_needed' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}