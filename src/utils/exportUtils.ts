import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

// Extend jsPDF type to include autoTable
interface ExtendedJsPDF extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export const generatePDF = (data: any, title: string) => {
  const doc = new jsPDF() as ExtendedJsPDF;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  
  // Add timestamp
  const timestamp = new Date().toLocaleString();
  doc.text(`Generated on: ${timestamp}`, 20, 30);

  // Add test coverage data if available
  if (data.coverage) {
    doc.text('Test Coverage', 20, 45);
    const coverageData = data.coverage.labels.map((label: string, index: number) => [
      label,
      `${data.coverage.datasets[0].data[index]}%`
    ]);
    autoTable(doc, {
      head: [['Test Type', 'Coverage']],
      body: coverageData,
      startY: 50
    });
  }

  // Add bug distribution if available
  if (data.distribution) {
    const startY = (doc.lastAutoTable?.finalY || 50) + 15;
    doc.text('Bug Distribution', 20, startY);
    const bugData = data.distribution.labels.map((label: string, index: number) => [
      label,
      data.distribution.datasets[0].data[index]
    ]);
    autoTable(doc, {
      head: [['Severity', 'Count']],
      body: bugData,
      startY: startY + 5
    });
  }

  // Add time analysis if available
  if (data.timeAnalysis) {
    const startY = (doc.lastAutoTable?.finalY || 50) + 15;
    doc.text('Testing Time Analysis', 20, startY);
    const timeData = data.timeAnalysis.labels.map((label: string, index: number) => [
      label,
      `${data.timeAnalysis.datasets[0].data[index]} hours`
    ]);
    autoTable(doc, {
      head: [['Sprint', 'Hours Spent']],
      body: timeData,
      startY: startY + 5
    });
  }

  return doc;
};

export const generateCSV = (data: any) => {
  let csvData: any[] = [];

  // Add test coverage data if available
  if (data.coverage) {
    csvData.push(['Test Coverage']);
    csvData.push(['Test Type', 'Coverage (%)']);
    data.coverage.labels.forEach((label: string, index: number) => {
      csvData.push([label, data.coverage.datasets[0].data[index]]);
    });
    csvData.push([]);  // Empty row for separation
  }

  // Add bug distribution if available
  if (data.distribution) {
    csvData.push(['Bug Distribution']);
    csvData.push(['Severity', 'Count']);
    data.distribution.labels.forEach((label: string, index: number) => {
      csvData.push([label, data.distribution.datasets[0].data[index]]);
    });
    csvData.push([]);  // Empty row for separation
  }

  // Add time analysis if available
  if (data.timeAnalysis) {
    csvData.push(['Testing Time Analysis']);
    csvData.push(['Sprint', 'Hours Spent']);
    data.timeAnalysis.labels.forEach((label: string, index: number) => {
      csvData.push([label, data.timeAnalysis.datasets[0].data[index]]);
    });
  }

  return Papa.unparse(csvData);
}; 