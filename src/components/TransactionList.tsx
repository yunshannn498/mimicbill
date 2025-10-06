import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, Trash2, CreditCard as Edit, RotateCcw } from 'lucide-react';
import { Transaction } from '../types/Transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onConvertEstimated: (id: string) => void;
  onConvertToEstimated: (id: string) => void;
  onConvertEstimatedExpense: (id: string) => void;
  onConvertToEstimatedExpense: (id: string) => void;
  onDelete: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onConvertEstimated,
  onConvertToEstimated,
  onConvertEstimatedExpense,
  onConvertToEstimatedExpense,
  onDelete,
  onEdit
}) => {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="w-5 h-5 text-green-600" />;
      case 'expense':
        return <ArrowDownLeft className="w-5 h-5 text-red-600" />;
      case 'estimated_income':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'estimated_expense':
        return <Clock className="w-5 h-5 text-orange-600" />;
    }
  };

  const getTransactionType = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return { label: '收入', color: 'text-green-600 bg-green-50' };
      case 'expense':
        return { label: '支出', color: 'text-red-600 bg-red-50' };
      case 'estimated_income':
        return { label: '预估收入', color: 'text-blue-600 bg-blue-50' };
      case 'estimated_expense':
        return { label: '预估支出', color: 'text-orange-600 bg-orange-50' };
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
        <div className="text-gray-400 mb-4">
          <ArrowUpRight className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无交易记录</h3>
        <p className="text-gray-500">点击添加按钮开始记录您的交易</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200">
        <h3 className="text-base md:text-lg font-semibold text-gray-800">交易记录</h3>
        <p className="text-xs md:text-sm text-gray-500 mt-1">共 {transactions.length} 条记录</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => {
          const typeInfo = getTransactionType(transaction.type);
          
          return (
            <div
              key={transaction.id}
              className="p-4 md:p-6 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start md:items-center justify-between gap-3">
                <div className="flex items-start md:items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                  <div className="p-1.5 md:p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">{transaction.name}</h4>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-1">
                      <span className={`px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${typeInfo.color} inline-block w-fit`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-3 flex-shrink-0">
                  <span className={`text-sm md:text-lg font-semibold ${
                    transaction.type === 'expense' || transaction.type === 'estimated_expense' ? 'text-red-600' : 'text-green-600'
                  } whitespace-nowrap`}>
                    {transaction.type === 'expense' || transaction.type === 'estimated_expense' ? '-' : '+'}¥{transaction.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </span>
                  
                  <div className="flex gap-1 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-1.5 md:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                      title="修改记录"
                    >
                      <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    
                    {transaction.type === 'income' && (
                      <button
                        onClick={() => onConvertToEstimated(transaction.id)}
                        className="p-1.5 md:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                        title="转为预估收入"
                      >
                        <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    )}
                    
                    {transaction.type === 'expense' && (
                      <button
                        onClick={() => onConvertToEstimatedExpense(transaction.id)}
                        className="p-1.5 md:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                        title="转为预估支出"
                      >
                        <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    )}
                    
                    {transaction.type === 'estimated_income' && !transaction.isConverted && (
                      <button
                        onClick={() => onConvertEstimated(transaction.id)}
                        className="p-1.5 md:p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="转为实际收入"
                      >
                        <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    )}
                    
                    {transaction.type === 'estimated_expense' && !transaction.isConverted && (
                      <button
                        onClick={() => onConvertEstimatedExpense(transaction.id)}
                        className="p-1.5 md:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="转为实际支出"
                      >
                        <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDelete(transaction)}
                      className="p-1.5 md:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="删除记录"
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};