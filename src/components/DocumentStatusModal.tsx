import React, { useState, useEffect } from 'react';
import { X, FileText, Users, FileCheck } from 'lucide-react';
import { Transaction, DocumentStatus } from '../types/Transaction';

interface DocumentStatusModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, contractStatus: DocumentStatus, thirdPartyStatus: DocumentStatus, invoiceStatus: DocumentStatus) => void;
}

export const DocumentStatusModal: React.FC<DocumentStatusModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onSave,
}) => {
  const [contractStatus, setContractStatus] = useState<DocumentStatus>('incomplete');
  const [thirdPartyStatus, setThirdPartyStatus] = useState<DocumentStatus>('incomplete');
  const [invoiceStatus, setInvoiceStatus] = useState<DocumentStatus>('incomplete');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (transaction) {
      setContractStatus(transaction.contractStatus || 'incomplete');
      setThirdPartyStatus(transaction.thirdPartyStatus || 'incomplete');
      setInvoiceStatus(transaction.invoiceStatus || 'incomplete');
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    setSaving(true);
    try {
      await onSave(transaction.id, contractStatus, thirdPartyStatus, invoiceStatus);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !transaction) return null;

  const renderStatusOption = (
    currentValue: DocumentStatus,
    setValue: (value: DocumentStatus) => void,
    label: string,
    icon: React.ReactNode
  ) => {
    const statusOptions: { value: DocumentStatus; label: string; color: string }[] = [
      { value: 'incomplete', label: '未完成', color: 'border-red-500 bg-red-50 text-red-700' },
      { value: 'not_needed', label: '不需要', color: 'border-gray-400 bg-gray-50 text-gray-700' },
      { value: 'completed', label: '已完成', color: 'border-green-500 bg-green-50 text-green-700' },
    ];

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue(option.value)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                currentValue === option.value
                  ? option.color
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">文件状态管理</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={saving}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">项目：</span>{transaction.name}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">金额：</span>¥{transaction.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {renderStatusOption(
            contractStatus,
            setContractStatus,
            '合同状态',
            <FileText className="w-4 h-4 text-blue-600" />
          )}

          {renderStatusOption(
            thirdPartyStatus,
            setThirdPartyStatus,
            '三方状态',
            <Users className="w-4 h-4 text-purple-600" />
          )}

          {renderStatusOption(
            invoiceStatus,
            setInvoiceStatus,
            '发票状态',
            <FileCheck className="w-4 h-4 text-orange-600" />
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={saving}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
