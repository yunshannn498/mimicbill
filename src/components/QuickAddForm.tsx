import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TransactionType } from '../types/Transaction';

interface QuickAddFormProps {
  type: TransactionType;
  onAdd: (name: string, amount: number, type: TransactionType) => void;
  title: string;
  bgColor: string;
  hoverColor: string;
}

export const QuickAddForm: React.FC<QuickAddFormProps> = ({
  type,
  onAdd,
  title,
  bgColor,
  hoverColor,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && amount.trim()) {
      onAdd(name.trim(), parseFloat(amount), type);
      setName('');
      setAmount('');
    }
  };

  return (
    <div className={`${bgColor} rounded-xl shadow-lg p-4 md:p-6 border border-gray-100`}>
      <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">{title}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="项目名称"
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all bg-white/90 placeholder-gray-500 text-sm md:text-base"
            required
          />
        </div>

        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="金额"
            step="0.01"
            min="0"
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all bg-white/90 placeholder-gray-500 text-sm md:text-base"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-white/20 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg ${hoverColor} transition-colors font-medium flex items-center justify-center gap-2 backdrop-blur-sm text-sm md:text-base`}
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          添加记录
        </button>
      </form>
    </div>
  );
};