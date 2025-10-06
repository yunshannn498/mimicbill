import { Transaction } from '../types/Transaction';

export const exportToJSON = (transactions: Transaction[]): void => {
  const dataStr = JSON.stringify(transactions, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (transactions: Transaction[]): void => {
  const headers = ['项目名称', '金额', '类型', '创建日期', '是否已转换'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction => [
      `"${transaction.name}"`,
      transaction.amount.toString(),
      getTypeLabel(transaction.type),
      transaction.date.toISOString(),
      transaction.isConverted ? '是' : '否'
    ].join(','))
  ].join('\n');

  const dataBlob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!Array.isArray(data)) {
          throw new Error('文件格式不正确，应为交易记录数组');
        }

        const transactions: Transaction[] = data.map((item: any) => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          name: item.name || '',
          amount: parseFloat(item.amount) || 0,
          type: item.type || 'expense',
          date: item.date ? new Date(item.date) : new Date(),
          isConverted: item.isConverted || false
        }));

        resolve(transactions);
      } catch (error) {
        reject(new Error('文件解析失败，请检查文件格式'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
};

export const importFromCSV = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV 文件格式不正确');
        }

        // 跳过标题行
        const dataLines = lines.slice(1);
        
        const transactions: Transaction[] = dataLines.map((line, index) => {
          const columns = parseCSVLine(line);
          
          if (columns.length < 4) {
            throw new Error(`第 ${index + 2} 行数据不完整`);
          }

          return {
            id: Math.random().toString(36).substr(2, 9),
            name: columns[0].replace(/^"|"$/g, ''), // 移除引号
            amount: parseFloat(columns[1]) || 0,
            type: getTypeFromLabel(columns[2]) || 'expense',
            date: columns[3] ? new Date(columns[3]) : new Date(),
            isConverted: columns[4] === '是'
          };
        });

        resolve(transactions);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('CSV 文件解析失败'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'income':
      return '收入';
    case 'expense':
      return '支出';
    case 'estimated_income':
      return '预估收入';
    case 'estimated_expense':
      return '预估支出';
    default:
      return '支出';
  }
};

const getTypeFromLabel = (label: string): 'income' | 'expense' | 'estimated_income' => {
  switch (label) {
    case '收入':
      return 'income';
    case '支出':
      return 'expense';
    case '预估收入':
      return 'estimated_income';
    case '预估支出':
      return 'estimated_expense';
    default:
      return 'expense';
  }
};