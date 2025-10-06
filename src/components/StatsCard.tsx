import React from 'react';

interface StatsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance' | 'estimated';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, amount, type, className = '' }) => {
  const getAmountColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'estimated':
        return 'text-orange-600';
      default:
        return amount >= 0 ? 'text-green-600' : 'text-red-600';
    }
  };

  const formatAmount = () => {
    if (type === 'balance') {
      // 对于结余，显示实际的正负号
      const sign = amount >= 0 ? '' : '-';
      return `${sign}¥${Math.abs(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
    } else {
      // 对于收入和支出，继续使用绝对值
      return `¥${Math.abs(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
    }
  };
  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className="text-center">
        <p className="text-xs md:text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className={`text-lg md:text-2xl font-bold ${getAmountColor()}`}>
          {formatAmount()}
        </p>
      </div>
    </div>
  );
};