import React, { useEffect } from 'react';
import { FiDownload, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartConfig {
  title: string;
  icon?: React.ReactNode;
}

interface ReportsProps {
  title?: string;
  onExport?: () => void;
  showExportButton?: boolean;
  recentReports?: Array<{
    name: string;
    type: string;
    date: string;
    onDownload?: () => void;
  }>;
  charts?: {
    chart1?: ChartConfig;
    chart2?: ChartConfig;
    chart3?: ChartConfig;
  };
  recentReportsTitle?: string;
}

const Reports: React.FC<ReportsProps> = ({
  title = "Reports & Analytics",
  onExport = () => {
    // Default export functionality
    const data = {
      reports: recentReports,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
  showExportButton = true,
  recentReports = [],
  charts = {
    chart1: { title: "Progress Overview", icon: <FiBarChart2 className="w-5 h-5 text-blue-600" /> },
    chart2: { title: "Resource Distribution", icon: <FiPieChart className="w-5 h-5 text-green-600" /> },
    chart3: { title: "Time Analysis", icon: <FiTrendingUp className="w-5 h-5 text-purple-600" /> }
  },
  recentReportsTitle = "Recent Reports"
}) => {
  // Sample data for charts
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Progress',
        data: [65, 75, 80, 85, 90, 95],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Development', 'Testing', 'Design', 'Planning'],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(168, 85, 247, 0.5)',
          'rgba(249, 115, 22, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(249, 115, 22)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Time Spent',
        data: [20, 35, 45, 30],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {showExportButton && (
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out"
          >
            <FiDownload className="w-4 h-4" />
            Export Reports
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            {charts.chart1?.icon}
            <h2 className="font-medium">{charts.chart1?.title}</h2>
          </div>
          <div className="h-48">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            {charts.chart2?.icon}
            <h2 className="font-medium">{charts.chart2?.title}</h2>
          </div>
          <div className="h-48">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            {charts.chart3?.icon}
            <h2 className="font-medium">{charts.chart3?.title}</h2>
          </div>
          <div className="h-48">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium">{recentReportsTitle}</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4 font-medium">Report Name</th>
                <th className="pb-4 font-medium">Type</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="py-4">{report.name}</td>
                  <td className="py-4">{report.type}</td>
                  <td className="py-4">{report.date}</td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={report.onDownload}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
              {recentReports.length === 0 && (
                <tr className="border-t border-gray-100">
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No recent reports available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports; 