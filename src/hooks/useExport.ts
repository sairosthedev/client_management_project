import { useState } from 'react';
import { generatePDF, generateCSV } from '../utils/exportUtils';

type ExportFormat = 'pdf' | 'csv';

export const useExport = () => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);

  const handleExport = (data: any, title: string) => {
    if (exportFormat === 'pdf') {
      const doc = generatePDF(data, title);
      doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    } else {
      const csv = generateCSV(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  return {
    exportFormat,
    setExportFormat,
    showFormatDropdown,
    setShowFormatDropdown,
    handleExport
  };
}; 