import React, { useEffect } from 'react';
import { Reports } from '../../components/shared';
import { FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import { ExportDropdown } from '../../components/ExportDropdown';
import { useExport } from '../../hooks/useExport';
import { testCoverageData, bugDistributionData, testingTimeData } from '../../data/qaReportsData';
import { generatePDF } from '../../utils/exportUtils';

const QAReports: React.FC = () => {
  const {
    exportFormat,
    setExportFormat,
    showFormatDropdown,
    setShowFormatDropdown,
    handleExport
  } = useExport();

  const qaData = {
    coverage: testCoverageData,
    distribution: bugDistributionData,
    timeAnalysis: testingTimeData
  };

  const [shouldExport, setShouldExport] = React.useState(false);

  useEffect(() => {
    if (shouldExport) {
      handleExport(qaData, 'QA Testing & Quality Metrics Report');
      setShouldExport(false);
    }
  }, [exportFormat, shouldExport, handleExport, qaData]);

  const recentReports = [
    {
      name: 'Test Coverage Report',
      type: 'Coverage',
      date: new Date().toLocaleDateString(),
      onDownload: () => {
        const data = {
          title: 'Test Coverage Report',
          coverage: testCoverageData
        };
        const doc = generatePDF(data, 'Test Coverage Report');
        doc.save(`test_coverage_report_${new Date().toISOString().split('T')[0]}.pdf`);
      }
    },
    {
      name: 'Bug Metrics Q2',
      type: 'Analysis',
      date: new Date().toLocaleDateString(),
      onDownload: () => {
        const data = {
          title: 'Bug Metrics Q2',
          distribution: bugDistributionData
        };
        const doc = generatePDF(data, 'Bug Metrics Report');
        doc.save(`bug_metrics_q2_${new Date().toISOString().split('T')[0]}.pdf`);
      }
    },
    {
      name: 'Regression Test Results',
      type: 'Test Results',
      date: new Date().toLocaleDateString(),
      onDownload: () => {
        const data = {
          title: 'Regression Test Results',
          timeAnalysis: testingTimeData
        };
        const doc = generatePDF(data, 'Regression Test Results');
        doc.save(`regression_test_results_${new Date().toISOString().split('T')[0]}.pdf`);
      }
    }
  ];

  const qaCharts = {
    chart1: {
      title: "Test Coverage Progress",
      icon: <FiBarChart2 className="w-5 h-5 text-blue-600" />,
      data: testCoverageData
    },
    chart2: {
      title: "Bug Distribution",
      icon: <FiPieChart className="w-5 h-5 text-green-600" />,
      data: bugDistributionData
    },
    chart3: {
      title: "Testing Time Analysis",
      icon: <FiTrendingUp className="w-5 h-5 text-purple-600" />,
      data: testingTimeData
    }
  };

  const handleFormatSelect = (format: 'pdf' | 'csv') => {
    setExportFormat(format);
    setShowFormatDropdown(false);
    setShouldExport(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <ExportDropdown
          exportFormat={exportFormat}
          showFormatDropdown={showFormatDropdown}
          setShowFormatDropdown={setShowFormatDropdown}
          onFormatSelect={handleFormatSelect}
        />
      </div>
      <Reports
        title="QA Testing & Quality Metrics"
        onExport={() => handleExport(qaData, 'QA Testing & Quality Metrics Report')}
        recentReports={recentReports}
        showExportButton={false}
        charts={qaCharts}
        recentReportsTitle="Recent Test Reports"
      />
    </div>
  );
};

export default QAReports; 