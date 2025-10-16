import React, { useState, useMemo } from 'react';
import { TrendingUp, Database, Plus, FileText } from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { QuickAddForm } from './components/QuickAddForm';
import { TransactionForm } from './components/TransactionForm';
import { FilterControls } from './components/FilterControls';
import { TransactionList } from './components/TransactionList';
import { ImportExportControls } from './components/ImportExportControls';
import { EditTransactionModal } from './components/EditTransactionModal';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { ImportExportModal } from './components/ImportExportModal';
import { OutstandingPaymentModal } from './components/OutstandingPaymentModal';
import { DocumentStatusModal } from './components/DocumentStatusModal';
import { useTransactions } from './hooks/useTransactions';
import { useAuth } from './hooks/useAuth';
import { FilterType, TransactionType, Transaction } from './types/Transaction';

function App() {
  const { user, loading: authLoading } = useAuth();
  const {
    transactions,
    loading: transactionsLoading,
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
  } = useTransactions();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertingTransaction, setConvertingTransaction] = useState<Transaction | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isOutstandingPaymentModalOpen, setIsOutstandingPaymentModalOpen] = useState(false);
  const [isDocumentStatusModalOpen, setIsDocumentStatusModalOpen] = useState(false);
  const [managingTransaction, setManagingTransaction] = useState<Transaction | null>(null);
  const [activeStatFilter, setActiveStatFilter] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let matchesFilter = true;
      if (filter === 'all') {
        matchesFilter = true;
      } else if (filter === 'incomplete_documents') {
        matchesFilter =
          transaction.type === 'estimated_income' &&
          (transaction.contractStatus === 'incomplete' || transaction.thirdPartyStatus === 'incomplete');
      } else {
        matchesFilter = transaction.type === filter;
      }

      // Amount range filter
      const min = minAmount ? parseFloat(minAmount) : 0;
      const max = maxAmount ? parseFloat(maxAmount) : Infinity;
      const matchesAmount = transaction.amount >= min && transaction.amount <= max;

      // Date range filter
      const transactionDate = (transaction.type === 'income' || transaction.type === 'expense')
        ? (transaction.convertedAt || transaction.date)
        : transaction.date;
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      let matchesDateRange = true;
      if (start) {
        matchesDateRange = matchesDateRange && transactionDate >= start;
      }
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && transactionDate <= endOfDay;
      }

      return matchesSearch && matchesFilter && matchesAmount && matchesDateRange;
    });
  }, [transactions, searchTerm, filter, minAmount, maxAmount, startDate, endDate]);

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (id: string, name: string, amount: number) => {
    updateTransaction(id, name, amount);
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const handleConvertToEstimated = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setConvertingTransaction(transaction);
      setIsConvertModalOpen(true);
    }
  };

  const handleConfirmConvert = () => {
    if (convertingTransaction) {
      convertIncomeToEstimated(convertingTransaction.id);
    }
    setIsConvertModalOpen(false);
    setConvertingTransaction(null);
  };

  const handleCloseConvertModal = () => {
    setIsConvertModalOpen(false);
    setConvertingTransaction(null);
  };

  const handleConvertToEstimatedExpense = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setConvertingTransaction(transaction);
      setIsConvertModalOpen(true);
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingTransaction) {
      deleteTransaction(deletingTransaction.id);
    }
    setIsDeleteModalOpen(false);
    setDeletingTransaction(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingTransaction(null);
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };


  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleOpenImportExport = () => {
    setIsImportExportModalOpen(true);
  };

  const handleCloseImportExport = () => {
    setIsImportExportModalOpen(false);
  };

  const handleOpenOutstandingPayment = () => {
    setIsOutstandingPaymentModalOpen(true);
  };

  const handleCloseOutstandingPayment = () => {
    setIsOutstandingPaymentModalOpen(false);
  };

  const handleManageDocumentStatus = (transaction: Transaction) => {
    setManagingTransaction(transaction);
    setIsDocumentStatusModalOpen(true);
  };

  const handleCloseDocumentStatusModal = () => {
    setIsDocumentStatusModalOpen(false);
    setManagingTransaction(null);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleStatCardClick = (statType: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    setActiveStatFilter(statType);

    switch (statType) {
      case 'income':
        setFilter('income');
        setStartDate(formatDate(firstDayOfMonth));
        setEndDate(formatDate(lastDayOfMonth));
        break;
      case 'expense':
        setFilter('expense');
        setStartDate(formatDate(firstDayOfMonth));
        setEndDate(formatDate(lastDayOfMonth));
        break;
      case 'balance':
        setFilter('all');
        setStartDate(formatDate(firstDayOfMonth));
        setEndDate(formatDate(lastDayOfMonth));
        break;
      case 'estimated_income':
        setFilter('estimated_income');
        setStartDate(formatDate(firstDayOfMonth));
        setEndDate(formatDate(lastDayOfMonth));
        break;
      case 'unpaid':
        setFilter('estimated_income');
        setStartDate('');
        setEndDate('');
        break;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with User Profile */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img 
              src="/image copy.png" 
              alt="米米记账" 
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg"
            />
            <h1 className="text-lg md:text-2xl font-bold text-gray-800">米米记账</h1>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <>
                <button
                  onClick={handleOpenOutstandingPayment}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm md:text-base"
                >
                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">未结款统计</span>
                  <span className="sm:hidden">未结</span>
                </button>
                <button
                  onClick={handleOpenImportExport}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm md:text-base"
                >
                  <Database className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">数据管理</span>
                  <span className="sm:hidden">数据</span>
                </button>
              </>
            )}
            <UserProfile onLoginClick={handleLoginClick} />
          </div>
        </div>

        {!user ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
            <div className="text-gray-400 mb-4">
              <img 
                src="/image copy.png" 
                alt="米米记账" 
                className="w-16 h-16 mx-auto rounded-lg"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">欢迎使用米米记账</h2>
            <p className="text-gray-600 mb-6">请登录或注册账户以开始记录您的交易</p>
            <button
              onClick={handleLoginClick}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              立即开始
            </button>
          </div>
        ) : (
          <>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
          <StatsCard
            title="当月收入"
            amount={monthlyStats.totalIncome}
            type="income"
            className="col-span-1"
            onClick={() => handleStatCardClick('income')}
            isActive={activeStatFilter === 'income'}
          />
          <StatsCard
            title="当月支出"
            amount={monthlyStats.totalExpense}
            type="expense"
            className="col-span-1"
            onClick={() => handleStatCardClick('expense')}
            isActive={activeStatFilter === 'expense'}
          />
          <StatsCard
            title="当月结余"
            amount={monthlyStats.balance}
            type="balance"
            className="col-span-1"
            onClick={() => handleStatCardClick('balance')}
            isActive={activeStatFilter === 'balance'}
          />
          <StatsCard
            title="当月签单金额"
            amount={monthlyStats.monthlyEstimatedIncome}
            type="estimated"
            className="col-span-1"
            onClick={() => handleStatCardClick('estimated_income')}
            isActive={activeStatFilter === 'estimated_income'}
          />
          <StatsCard
            title="未结款金额"
            amount={monthlyStats.unpaidAmount}
            type="estimated"
            className="col-span-1"
            onClick={() => handleStatCardClick('unpaid')}
            isActive={activeStatFilter === 'unpaid'}
          />
        </div>

        {/* Quick Add Forms - Hidden on Mobile */}
        <div className="mb-6 md:mb-8">
          {/* Desktop: 4-column layout, Hidden on Mobile */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <QuickAddForm
              type="income"
              onAdd={addTransaction}
              title="添加收入"
              bgColor="bg-green-600"
              hoverColor="hover:bg-white/30"
            />
            <QuickAddForm
              type="expense"
              onAdd={addTransaction}
              title="添加支出"
              bgColor="bg-red-600"
              hoverColor="hover:bg-white/30"
            />
            <QuickAddForm
              type="estimated_income"
              onAdd={addTransaction}
              title="添加预估收入"
              bgColor="bg-blue-600"
              hoverColor="hover:bg-white/30"
            />
            <QuickAddForm
              type="estimated_expense"
              onAdd={addTransaction}
              title="添加预估支出"
              bgColor="bg-orange-600"
              hoverColor="hover:bg-white/30"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-4 md:mb-6">
          <FilterControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filter={filter}
            onFilterChange={setFilter}
            minAmount={minAmount}
            maxAmount={maxAmount}
            onMinAmountChange={setMinAmount}
            onMaxAmountChange={setMaxAmount}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          onConvertEstimated={convertEstimatedToIncome}
          onConvertToEstimated={handleConvertToEstimated}
          onConvertEstimatedExpense={convertEstimatedToExpense}
          onConvertToEstimatedExpense={handleConvertToEstimatedExpense}
          onDelete={handleDeleteTransaction}
          onEdit={handleEditTransaction}
          onManageDocumentStatus={handleManageDocumentStatus}
        />

        {/* Edit Transaction Modal */}
        <EditTransactionModal
          transaction={editingTransaction}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />

        {/* Add Transaction Modal */}
        <TransactionForm
          onAdd={addTransaction}
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
        />

        {/* Convert to Estimated Modal */}
        <ConfirmModal
          isOpen={isConvertModalOpen}
          onClose={handleCloseConvertModal}
          onConfirm={handleConfirmConvert}
          title="转换确认"
          message="确定要将此收入转为预估收入吗？"
          type="warning"
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="删除确认"
          message={`确定要删除交易记录"${deletingTransaction?.name}"吗？此操作无法撤销。`}
          confirmText="删除"
          cancelText="取消"
          type="danger"
        />
          </>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleCloseAuthModal}
        />

        {/* Import/Export Modal */}
        <ImportExportModal
          isOpen={isImportExportModalOpen}
          onClose={handleCloseImportExport}
          transactions={transactions}
          onImport={importTransactions}
        />

        {/* Outstanding Payment Modal */}
        <OutstandingPaymentModal
          isOpen={isOutstandingPaymentModalOpen}
          onClose={handleCloseOutstandingPayment}
          transactions={transactions}
          onUpdateDocumentStatus={updateDocumentStatus}
        />

        {/* Document Status Modal */}
        <DocumentStatusModal
          isOpen={isDocumentStatusModalOpen}
          onClose={handleCloseDocumentStatusModal}
          transaction={managingTransaction}
          onSave={updateDocumentStatus}
        />


        {/* Mobile Floating Add Button */}
        <button
          onClick={handleOpenAddModal}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default App;