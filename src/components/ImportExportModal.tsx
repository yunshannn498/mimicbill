import React, { useRef, useState } from 'react';
import { X, Download, Upload, FileText, FileSpreadsheet, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { Transaction } from '../types/Transaction';
import { exportToJSON, exportToCSV, importFromJSON, importFromCSV } from '../utils/importExport';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => Promise<{ imported: number; skipped: number } | void>;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importType, setImportType] = useState<'json' | 'csv'>('json');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportJSON = () => {
    try {
      exportToJSON(transactions);
      showMessage('success', 'JSON 文件导出成功');
    } catch (error) {
      showMessage('error', '导出失败，请重试');
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(transactions);
      showMessage('success', 'CSV 文件导出成功');
    } catch (error) {
      showMessage('error', '导出失败，请重试');
    }
  };

  const handleImportClick = (type: 'json' | 'csv') => {
    setImportType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let importedTransactions: Transaction[];

      if (importType === 'json') {
        importedTransactions = await importFromJSON(file);
      } else {
        importedTransactions = await importFromCSV(file);
      }

      const result = await onImport(importedTransactions) as any;

      if (result && typeof result === 'object' && 'imported' in result) {
        let message = `成功导入 ${result.imported} 条交易记录`;
        if (result.skipped > 0) {
          message += `，跳过 ${result.skipped} 条重复记录`;
        }
        showMessage('success', message);
      } else {
        showMessage('success', `成功导入 ${importedTransactions.length} 条交易记录`);
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '导入失败');
    }

    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src="/image copy.png" 
              alt="米米记账" 
              className="w-8 h-8 rounded-lg"
            />
            <h2 className="text-xl font-semibold text-gray-800">数据管理</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          {message && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-4 ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">导出数据</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  disabled={transactions.length === 0}
                >
                  <Download className="w-4 h-4" />
                  <FileText className="w-4 h-4" />
                  JSON
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  disabled={transactions.length === 0}
                >
                  <Download className="w-4 h-4" />
                  <FileSpreadsheet className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">导入数据</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleImportClick('json')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  <FileText className="w-4 h-4" />
                  JSON
                </button>

                <button
                  onClick={() => handleImportClick('csv')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  <FileSpreadsheet className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p className="mb-1">• 导出功能会将所有交易记录保存为文件，包含完整的时间信息</p>
              <p className="mb-1">• 导入功能会自动检测并跳过重复记录（基于项目名称、金额、类型、日期）</p>
              <p className="mb-1">• 导入时会保留原始的创建时间</p>
              <p>• 支持 JSON 和 CSV 两种格式</p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={importType === 'json' ? '.json' : '.csv'}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};