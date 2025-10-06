import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { TransactionType } from '../types/Transaction';

interface TransactionFormProps {
  onAdd: (name: string, amount: number, type: TransactionType) => void;
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, isOpen, onClose, defaultType = 'expense' }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(defaultType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && amount.trim()) {
      onAdd(name.trim(), parseFloat(amount), type);
      setName('');
      setAmount('');
      setType(defaultType);
      onClose();
    }
  };

  const getTypeOptions = () => [
    { value: 'expense' as TransactionType, label: '支出', color: 'text-red-600' },
    { value: 'income' as TransactionType, label: '收入', color: 'text-green-600' },
    { value: 'estimated_income' as TransactionType, label: '预估收入', color: 'text-orange-600' },
    { value: 'estimated_expense' as TransactionType, label: '预估支出', color: 'text-purple-600' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">添加交易记录</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              交易类型
            </label>
            <div className="grid grid-cols-3 gap-2">
              {getTypeOptions().map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    type === option.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              项目名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入项目名称"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              金额 (¥)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="请输入金额"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              inputMode="decimal"
              pattern="[0-9]*"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            添加记录
          </button>
        </form>
      </div>
    </div>
  );
};