import { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionType, DocumentStatus } from '../types/Transaction';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // 从数据库加载交易记录
  const loadTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTransactions: Transaction[] = data.map(item => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        type: item.type,
        date: new Date(item.created_at),
        isConverted: item.is_converted,
        convertedAt: item.converted_at ? new Date(item.converted_at) : undefined,
        contractStatus: item.contract_status || 'incomplete',
        thirdPartyStatus: item.third_party_status || 'incomplete',
        invoiceStatus: item.invoice_status || 'incomplete',
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // 用户登录后加载数据
  useEffect(() => {
    if (user) {
      loadTransactions();
    } else {
      setTransactions([]);
    }
  }, [user]);

  const addTransaction = async (name: string, amount: number, type: TransactionType) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          name,
          amount,
          type,
          is_converted: false,
          contract_status: 'incomplete',
          third_party_status: 'incomplete',
          invoice_status: 'incomplete',
        })
        .select()
        .single();

      if (error) throw error;

      const newTransaction: Transaction = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        type: data.type,
        date: new Date(data.created_at),
        isConverted: data.is_converted,
        convertedAt: data.converted_at ? new Date(data.converted_at) : undefined,
        contractStatus: data.contract_status || 'incomplete',
        thirdPartyStatus: data.third_party_status || 'incomplete',
        invoiceStatus: data.invoice_status || 'incomplete',
      };

      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const convertEstimatedToIncome = async (id: string) => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('transactions')
        .update({
          type: 'income',
          is_converted: true,
          converted_at: now,
        })
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id && transaction.type === 'estimated_income'
            ? { ...transaction, type: 'income' as TransactionType, isConverted: true, convertedAt: new Date(now) }
            : transaction
        )
      );
    } catch (error) {
      console.error('Error converting transaction:', error);
    }
  };

  const convertIncomeToEstimated = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          type: 'estimated_income',
          is_converted: false,
          converted_at: null,
        })
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id && transaction.type === 'income'
            ? { ...transaction, type: 'estimated_income' as TransactionType, isConverted: false, convertedAt: undefined }
            : transaction
        )
      );
    } catch (error) {
      console.error('Error converting transaction:', error);
    }
  };

  const convertEstimatedToExpense = async (id: string) => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('transactions')
        .update({
          type: 'expense',
          is_converted: true,
          converted_at: now,
        })
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id && transaction.type === 'estimated_expense'
            ? { ...transaction, type: 'expense' as TransactionType, isConverted: true, convertedAt: new Date(now) }
            : transaction
        )
      );
    } catch (error) {
      console.error('Error converting transaction:', error);
    }
  };

  const convertExpenseToEstimated = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          type: 'estimated_expense',
          is_converted: false,
          converted_at: null,
        })
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id && transaction.type === 'expense'
            ? { ...transaction, type: 'estimated_expense' as TransactionType, isConverted: false, convertedAt: undefined }
            : transaction
        )
      );
    } catch (error) {
      console.error('Error converting transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const updateTransaction = async (id: string, name: string, amount: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          name,
          amount,
        })
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id
            ? { ...transaction, name, amount }
            : transaction
        )
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const importTransactions = async (newTransactions: Transaction[]) => {
    if (!user) return;

    // 获取现有交易记录的名称、金额、类型、时间组合，用于去重
    const existingTransactionKeys = new Set(
      transactions.map(t => `${t.name}-${t.amount}-${t.type}-${t.date.toISOString().split('T')[0]}`)
    );

    // 过滤掉重复的交易记录
    const uniqueTransactions = newTransactions.filter(transaction => {
      const key = `${transaction.name}-${transaction.amount}-${transaction.type}-${transaction.date.toISOString().split('T')[0]}`;
      return !existingTransactionKeys.has(key);
    });

    if (uniqueTransactions.length === 0) {
      throw new Error('没有新的交易记录需要导入，所有记录都已存在');
    }

    if (uniqueTransactions.length < newTransactions.length) {
      const duplicateCount = newTransactions.length - uniqueTransactions.length;
      console.warn(`跳过了 ${duplicateCount} 条重复记录（基于名称、金额、类型、日期匹配）`);
    }

    try {
      const transactionsToInsert = uniqueTransactions.map(transaction => ({
        user_id: user.id,
        name: transaction.name,
        amount: transaction.amount,
        type: transaction.type,
        is_converted: transaction.isConverted || false,
        created_at: transaction.date.toISOString(),
      }));

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionsToInsert)
        .select();

      if (error) throw error;

      const formattedTransactions: Transaction[] = data.map(item => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        type: item.type,
        date: new Date(item.created_at),
        isConverted: item.is_converted,
        convertedAt: item.converted_at ? new Date(item.converted_at) : undefined,
        contractStatus: item.contract_status || 'incomplete',
        thirdPartyStatus: item.third_party_status || 'incomplete',
        invoiceStatus: item.invoice_status || 'incomplete',
      }));

      setTransactions(prev => [...formattedTransactions, ...prev]);

      return {
        imported: formattedTransactions.length,
        skipped: newTransactions.length - uniqueTransactions.length
      };
    } catch (error) {
      console.error('Error importing transactions:', error);
      throw error;
    }
  };

  const updateDocumentStatus = async (
    id: string,
    contractStatus: DocumentStatus,
    thirdPartyStatus: DocumentStatus,
    invoiceStatus: DocumentStatus
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          contract_status: contractStatus,
          third_party_status: thirdPartyStatus,
          invoice_status: invoiceStatus,
        })
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id
            ? {
                ...transaction,
                contractStatus,
                thirdPartyStatus,
                invoiceStatus,
              }
            : transaction
        )
      );
    } catch (error) {
      console.error('Error updating document status:', error);
    }
  };

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalIncome = transactions
      .filter(t => {
        if (t.type !== 'income') return false;
        const dateToUse = t.convertedAt || t.date;
        return (
          dateToUse.getMonth() === currentMonth &&
          dateToUse.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => {
        if (t.type !== 'expense') return false;
        const dateToUse = t.convertedAt || t.date;
        return (
          dateToUse.getMonth() === currentMonth &&
          dateToUse.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyEstimatedIncome = transactions
      .filter(t => {
        if (t.type !== 'estimated_income') return false;
        return (
          t.date.getMonth() === currentMonth &&
          t.date.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const cumulativeEstimatedIncome = transactions
      .filter(t => t.type === 'estimated_income')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      monthlyEstimatedIncome,
      unpaidAmount: cumulativeEstimatedIncome,
      balance: totalIncome - totalExpense,
    };
  }, [transactions]);

  return {
    transactions,
    loading,
    monthlyStats,
    addTransaction,
    convertEstimatedToIncome,
    convertIncomeToEstimated,
    convertEstimatedToExpense,
    convertExpenseToEstimated,
    deleteTransaction,
    updateTransaction,
    importTransactions,
    updateDocumentStatus,
  };
};