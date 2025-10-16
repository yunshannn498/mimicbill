import React, { useMemo, useState } from 'react';
import { X, FileText } from 'lucide-react';
import { Transaction, DocumentStatus } from '../types/Transaction';

interface OutstandingPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onUpdateDocumentStatus?: (id: string, contractStatus: DocumentStatus, thirdPartyStatus: DocumentStatus, invoiceStatus: DocumentStatus) => void;
}

export const OutstandingPaymentModal: React.FC<OutstandingPaymentModalProps> = ({
  isOpen,
  onClose,
  transactions,
  onUpdateDocumentStatus,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const hasIncompleteDocuments = (transaction: Transaction) => {
    return transaction.contractStatus === 'incomplete' || transaction.thirdPartyStatus === 'incomplete';
  };

  const getStatusLabel = (status?: DocumentStatus) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'not_needed':
        return '不需要';
      case 'incomplete':
      default:
        return '未完成';
    }
  };

  const getStatusColor = (status?: DocumentStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'not_needed':
        return 'text-gray-600 bg-gray-50';
      case 'incomplete':
      default:
        return 'text-red-600 bg-red-50';
    }
  };

  const handleStatusChange = (
    transactionId: string,
    field: 'contract' | 'thirdParty' | 'invoice',
    value: DocumentStatus
  ) => {
    if (!onUpdateDocumentStatus) return;

    const transaction = outstandingPayments.find(t => t.id === transactionId);
    if (!transaction) return;

    const updates = {
      contract: transaction.contractStatus || 'incomplete',
      thirdParty: transaction.thirdPartyStatus || 'incomplete',
      invoice: transaction.invoiceStatus || 'incomplete',
    };

    updates[field] = value;

    onUpdateDocumentStatus(transactionId, updates.contract, updates.thirdParty, updates.invoice);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
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
                  className={`rounded-lg p-4 border transition-all duration-200 ${
                    hasIncompleteDocuments(transaction)
                      ? 'bg-gradient-to-r from-red-50 to-white border-red-200 hover:shadow-md'
                      : 'bg-gradient-to-r from-orange-50 to-white border-orange-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-semibold truncate mb-1 ${
                        hasIncompleteDocuments(transaction) ? 'text-red-800' : 'text-gray-800'
                      }`}>
                        {transaction.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className={`text-lg font-bold ${
                        hasIncompleteDocuments(transaction) ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        ¥{transaction.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out shadow-sm ${
                          hasIncompleteDocuments(transaction)
                            ? 'bg-gradient-to-r from-red-500 to-red-400'
                            : 'bg-gradient-to-r from-orange-500 to-orange-400'
                        }`}
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

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">合同状态</label>
                      <select
                        value={transaction.contractStatus || 'incomplete'}
                        onChange={(e) => handleStatusChange(transaction.id, 'contract', e.target.value as DocumentStatus)}
                        className={`w-full px-2 py-1.5 text-xs rounded-md border transition-colors ${getStatusColor(transaction.contractStatus)} border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                      >
                        <option value="incomplete">未完成</option>
                        <option value="not_needed">不需要</option>
                        <option value="completed">已完成</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">三方状态</label>
                      <select
                        value={transaction.thirdPartyStatus || 'incomplete'}
                        onChange={(e) => handleStatusChange(transaction.id, 'thirdParty', e.target.value as DocumentStatus)}
                        className={`w-full px-2 py-1.5 text-xs rounded-md border transition-colors ${getStatusColor(transaction.thirdPartyStatus)} border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                      >
                        <option value="incomplete">未完成</option>
                        <option value="not_needed">不需要</option>
                        <option value="completed">已完成</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">发票状态</label>
                      <select
                        value={transaction.invoiceStatus || 'incomplete'}
                        onChange={(e) => handleStatusChange(transaction.id, 'invoice', e.target.value as DocumentStatus)}
                        className={`w-full px-2 py-1.5 text-xs rounded-md border transition-colors ${getStatusColor(transaction.invoiceStatus)} border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                      >
                        <option value="incomplete">未完成</option>
                        <option value="not_needed">不需要</option>
                        <option value="completed">已完成</option>
                      </select>
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
