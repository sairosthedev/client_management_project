export const testCoverageData = {
  labels: ['Unit Tests', 'Integration Tests', 'E2E Tests', 'API Tests', 'UI Tests', 'Security Tests'],
  datasets: [{
    label: 'Coverage %',
    data: [85, 78, 92, 88, 75, 82],
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderColor: 'rgb(59, 130, 246)',
    borderWidth: 1,
  }]
};

export const bugDistributionData = {
  labels: ['Critical', 'High', 'Medium', 'Low'],
  datasets: [{
    data: [5, 15, 45, 35],
    backgroundColor: [
      'rgba(239, 68, 68, 0.5)',
      'rgba(249, 115, 22, 0.5)',
      'rgba(234, 179, 8, 0.5)',
      'rgba(34, 197, 94, 0.5)',
    ],
    borderColor: [
      'rgb(239, 68, 68)',
      'rgb(249, 115, 22)',
      'rgb(234, 179, 8)',
      'rgb(34, 197, 94)',
    ],
    borderWidth: 1,
  }]
};

export const testingTimeData = {
  labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'],
  datasets: [{
    label: 'Hours Spent',
    data: [45, 52, 48, 56],
    borderColor: 'rgb(168, 85, 247)',
    backgroundColor: 'rgba(168, 85, 247, 0.5)',
    tension: 0.4,
  }]
}; 