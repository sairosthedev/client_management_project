import React from 'react';
import { Reports } from '../../components/shared';
import { FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';

const ManagerReports: React.FC = () => {
  const handleExport = () => {
    // Implement manager-specific export logic
    console.log('Exporting manager reports...');
  };

  const recentReports = [
    {
      name: 'Project Overview Q2',
      type: 'Summary',
      date: new Date().toLocaleDateString(),
      onDownload: () => console.log('Downloading Project Overview Q2...')
    }
  ];

  const managerCharts = {
    chart1: {
      title: "Project Progress",
      icon: <FiBarChart2 className="w-5 h-5 text-blue-600" />
    },
    chart2: {
      title: "Resource Allocation",
      icon: <FiPieChart className="w-5 h-5 text-green-600" />
    },
    chart3: {
      title: "Budget & Time Tracking",
      icon: <FiTrendingUp className="w-5 h-5 text-purple-600" />
    }
  };

  return (
    <Reports
      title="Project Management Analytics"
      onExport={handleExport}
      recentReports={recentReports}
      showExportButton={true}
      charts={managerCharts}
      recentReportsTitle="Recent Project Reports"
    />
  );
};

export default ManagerReports; 