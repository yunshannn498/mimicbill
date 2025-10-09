import React, { useMemo } from 'react';
import { X, FileText } from 'lucide-react';
import { Transaction } from '../types/Transaction';

interface OutstandingPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export const OutstandingPaymentModal: React.FC<OutstandingPaymentModalProps> = ({
  isOpen,
  onClose,
  transactions,
}) => {
  const outstandingPayments = useMemo(() => {
    return transactions
      .filter(t => t.type === 'estimated_income')
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const maxAmount = useMemo(() => {
    if (outstandingPayments.length === 0) return 0;
    return Math.max(...outstandingPayments.map(t => t.amount));
  }, [outstandingPayments]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getBarWidth = (amount: number) => {
    if (maxAmount === 0) return 0;
    return (amount / maxAmount) * 100;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/image copy.png"
              alt="米米记账"
              className="w-8 h-8 rounded-lg"
            />
            <h2 className="text-xl font-semibold text-gray-800">未结款统计</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {outstandingPayments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">暂无未结款项目</h3>
              <p className="text-gray-500">当前没有任何未结款的预估收入记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {outstandingPayments.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-gradient-to-r from-orange-50 to-white rounded-lg p-4 border border-orange-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-800 truncate mb-1">
                        {transaction.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-lg font-bold text-orange-600">
                        ¥{transaction.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500 ease-out shadow-sm"
                      style={{ width: `${getBarWidth(transaction.amount)}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-end pr-3">
                      <span className="text-xs font-medium text-gray-600">
                        {getBarWidth(transaction.amount).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {outstandingPayments.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                共 {outstandingPayments.length} 个未结款项目
              </span>
              <span className="text-base font-bold text-orange-600">
                总计: ¥{outstandingPayments.reduce((sum, t) => sum + t.amount, 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
