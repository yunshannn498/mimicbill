export type DocumentStatus = 'incomplete' | 'not_needed' | 'completed';

export interface DocumentStatuses {
  contractStatus: DocumentStatus;
  thirdPartyStatus: DocumentStatus;
  invoiceStatus: DocumentStatus;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'expense' | 'income' | 'estimated_income' | 'estimated_expense';
  date: Date;
  isConverted?: boolean;
  convertedAt?: Date;
  contractStatus?: DocumentStatus;
  thirdPartyStatus?: DocumentStatus;
  invoiceStatus?: DocumentStatus;
}

export type TransactionType = Transaction['type'];
export type FilterType = TransactionType | 'all' | 'incomplete_documents';