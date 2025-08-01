import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { format, subMonths } from 'date-fns';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });
  const [trendData, setTrendData] = useState({ labels: [], datasets: [] });
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    topCategory: { name: 'N/A', amount: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAnalyticsData();
  }, [timeRange, token, navigate, fetchAnalyticsData]);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const [categoryRes, monthlyRes, trendRes, summaryRes] = await Promise.all([
        axios.get(`/api/transactions/category-summary?timeRange=${timeRange}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/transactions/monthly-summary?timeRange=${timeRange}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/transactions/trend?timeRange=${timeRange}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/transactions/summary', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Process category data for pie chart
      const categoryLabels = categoryRes.data.map(item => item._id);
      const categoryAmounts = categoryRes.data.map(item => Math.abs(item.total));
      const categoryColors = generateColors(categoryLabels.length);

      setCategoryData({
        labels: categoryLabels,
        datasets: [{
          data: categoryAmounts,
          backgroundColor: categoryColors,
          borderWidth: 1,
          hoverOffset: 15
        }]
      });

      // Process monthly data for bar chart
      const monthlyLabels = monthlyRes.data.map(item => 
        new Date(item._id).toLocaleString('default', { month: 'short' })
      );
      const monthlyIncome = monthlyRes.data.map(item => item.income || 0);
      const monthlyExpenses = monthlyRes.data.map(item => Math.abs(item.expense || 0));

      setMonthlyData({
        labels: monthlyLabels,
        datasets: [
          {
            label: 'Income',
            data: monthlyIncome,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.7,
            categoryPercentage: 0.8
          },
          {
            label: 'Expenses',
            data: monthlyExpenses,
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.7,
            categoryPercentage: 0.8
          }
        ]
      });

      // Process trend data for line chart
      const trendLabels = trendRes.data.map(item => new Date(item.date));
      const trendValues = trendRes.data.map(item => Math.abs(item.amount));
      
      setTrendData({
        labels: trendLabels,
        datasets: [
          {
            label: 'Daily Spending',
            data: trendValues,
            borderColor: 'rgba(99, 102, 241, 0.8)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5
          }
        ]
      });

      // Process summary data
      const totalIncome = summaryRes.data.income?.total || 0;
      const totalExpenses = Math.abs(summaryRes.data.expense?.total) || 0;
      const topCategory = categoryRes.data.length > 0 
        ? { 
            name: categoryRes.data[0]._id, 
            amount: Math.abs(categoryRes.data[0].total) 
          }
        : { name: 'N/A', amount: 0 };

      setSummary({
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        topCategory
      });
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to fetch analytics data. Please try again later.');
        console.error('Analytics error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [timeRange, token, logout, navigate]);

  const generateColors = (count) => {
    const baseColors = [
      '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#0EA5E9', '#6366F1'
    ];
    
    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }
    
    // Generate additional colors if needed
    const colors = [...baseColors];
    const hueStep = 360 / (count - baseColors.length);
    
    for (let i = 0; i < count - baseColors.length; i++) {
      const hue = (i * hueStep) % 360;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    
    return colors;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleExportData = () => {
    const data = [
      ['Category', 'Amount'],
      ...categoryData.labels.map((label, index) => [
        label,
        categoryData.datasets[0].data[index]
      ])
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SpendingByCategory');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `spending-analytics-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses',
        font: {
          size: 16,
          weight: '600'
        },
        padding: { bottom: 15 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => formatCurrency(value).replace('$', '')
        },
        title: {
          display: true,
          text: 'Amount',
          padding: { top: 10, bottom: 10 }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        title: {
          display: true,
          text: 'Month',
          padding: { top: 10 }
        }
      }
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                
                return {
                  text: `${label}: ${formatCurrency(value)} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  hidden: isNaN(dataset.data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                  index: i,
                  datasetIndex: 0
                };
              });
            }
            return [];
          }
        }
      },
      title: {
        display: true,
        text: 'Spending by Category',
        font: {
          size: 16,
          weight: '600'
        },
        padding: { bottom: 15 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '60%',
    radius: '85%',
    layout: {
      padding: 20
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Daily Spending Trend',
        font: {
          size: 16,
          weight: '600'
        },
        padding: { bottom: 15 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => formatCurrency(value).replace('$', '')
        },
        title: {
          display: true,
          text: 'Amount',
          padding: { top: 10, bottom: 10 }
        }
      },
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM d, yyyy',
          displayFormats: {
            day: 'MMM d'
          }
        },
        grid: {
          display: false,
          drawBorder: false
        },
        title: {
          display: true,
          text: 'Date',
          padding: { top: 10 }
        }
      }
    },
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 2,
        borderColor: 'rgba(99, 102, 241, 0.8)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true
      },
      point: {
        radius: 3,
        hoverRadius: 6,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgba(99, 102, 241, 0.8)'
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Track and analyze your spending patterns</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="month">This Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={handleExportData}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1 w-full sm:w-auto justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
            <p className="text-xs text-gray-400 mt-1">Your total earnings</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p>
            <p className="text-xs text-gray-400 mt-1">Your total spending</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Balance</p>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(summary.balance)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Your current balance</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Top Category</p>
            <p className="text-xl font-bold text-gray-800 truncate">{summary.topCategory.name}</p>
            <p className="text-sm text-gray-500">{formatCurrency(summary.topCategory.amount)}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Overview */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Monthly Overview</h2>
            </div>
            <div className="h-80">
              <Bar data={monthlyData} options={barOptions} />
            </div>
          </div>

          {/* Spending by Category */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Spending by Category</h2>
              {categoryData.labels.length > 0 && (
                <button 
                  onClick={handleExportData}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  title="Export categories"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
              )}
            </div>
            <div className="h-80">
              {categoryData.labels.length > 0 ? (
                <Pie data={categoryData} options={pieOptions} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No category data available</p>
                  <p className="text-xs mt-1">Add transactions to see category breakdown</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daily Trend */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Daily Spending Trend</h2>
          </div>
          <div className="h-96">
            {trendData.labels.length > 0 ? (
              <Line data={trendData} options={lineOptions} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p>No trend data available</p>
                <p className="text-xs mt-1">Add more transactions to see spending trends</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h2>
          {categoryData.labels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryData.labels.map((label, index) => {
                const amount = categoryData.datasets[0].data[index];
                const total = categoryData.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((amount / total) * 100).toFixed(1);
                const color = categoryData.datasets[0].backgroundColor[index];
                
                return (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-800">{label}</h3>
                        <p className="text-2xl font-bold" style={{ color }}>{formatCurrency(amount)}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No category data available. Add transactions to see category breakdown.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
