import React from 'react';
import { Search, Filter, DollarSign, Calendar } from 'lucide-react';
import { FilterType } from '../types/Transaction';

interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  minAmount: string;
  maxAmount: string;
  onMinAmountChange: (amount: string) => void;
  onMaxAmountChange: (amount: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  minAmount,
  maxAmount,
  onMinAmountChange,
  onMaxAmountChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const filterOptions = [
    { value: 'all' as FilterType, label: '全部', count: 0 },
    { value: 'expense' as FilterType, label: '支出', count: 0 },
    { value: 'income' as FilterType, label: '收入', count: 0 },
    { value: 'estimated_income' as FilterType, label: '预估收入', count: 0 },
    { value: 'estimated_expense' as FilterType, label: '预估支出', count: 0 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 p-4 md:p-6 border-b border-gray-100">
        <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        <h3 className="text-sm md:text-base font-medium text-gray-800">筛选条件</h3>
      </div>
      
      <div className="p-4 md:p-6 pt-0">
        <div className="flex flex-col gap-4">
          {/* Search and Type Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="搜索项目名称..."
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm md:text-base"
              />
            </div>
          
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => onFilterChange(e.target.value as FilterType)}
                className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white min-w-[100px] md:min-w-[120px] text-sm md:text-base"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">日期范围:</span>
            </div>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1 min-w-[120px]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs md:text-sm"
                />
              </div>
              
              <span className="text-gray-500 text-xs md:text-sm">至</span>
              
              <div className="flex-1 min-w-[120px]">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs md:text-sm"
                />
              </div>
              
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    onStartDateChange('');
                    onEndDateChange('');
                  }}
                  className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  清除
                </button>
              )}
            </div>
          </div>
            
          {/* Amount Range Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">金额范围:</span>
            </div>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1 min-w-[80px]">
                <input
                  type="number"
                  value={minAmount}
                  onChange={(e) => onMinAmountChange(e.target.value)}
                  placeholder="最小金额"
                  min="0"
                  step="0.01"
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs md:text-sm"
                />
              </div>
              
              <span className="text-gray-500 text-xs md:text-sm">至</span>
              
              <div className="flex-1 min-w-[80px]">
                <input
                  type="number"
                  value={maxAmount}
                  onChange={(e) => onMaxAmountChange(e.target.value)}
                  placeholder="最大金额"
                  min="0"
                  step="0.01"
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-xs md:text-sm"
                />
              </div>
              
              {(minAmount || maxAmount) && (
                <button
                  onClick={() => {
                    onMinAmountChange('');
                    onMaxAmountChange('');
                  }}
                  className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  清除
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};