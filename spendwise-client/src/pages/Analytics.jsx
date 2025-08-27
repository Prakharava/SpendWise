import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { format, subMonths } from 'date-fns';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Mock data - replace with actual API calls
const mockExpensesByCategory = [
  { category: 'Food & Drinks', amount: 350 },
  { category: 'Shopping', amount: 220 },
  { category: 'Transportation', amount: 150 },
  { category: 'Housing', amount: 1200 },
  { category: 'Utilities', amount: 180 },
  { category: 'Entertainment', amount: 120 },
  { category: 'Health', amount: 90 },
  { category: 'Other', amount: 75 },
];

const mockMonthlyData = [
  { month: 'Jan', income: 3000, expenses: 2500 },
  { month: 'Feb', income: 3200, expenses: 2800 },
  { month: 'Mar', income: 4000, expenses: 3200 },
  { month: 'Apr', income: 3500, expenses: 2900 },
  { month: 'May', income: 3800, expenses: 3100 },
  { month: 'Jun', income: 4200, expenses: 3500 },
];

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('6m');
  const [isLoading, setIsLoading] = useState(true);
  
  // In a real app, you would fetch this data from your API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Prepare data for charts
  const categoryData = {
    labels: mockExpensesByCategory.map(item => item.category),
    datasets: [
      {
        data: mockExpensesByCategory.map(item => item.amount),
        backgroundColor: [
          '#3B82F6', // blue-500
          '#10B981', // emerald-500
          '#F59E0B', // amber-500
          '#EF4444', // red-500
          '#8B5CF6', // violet-500
          '#EC4899', // pink-500
          '#14B8A6', // teal-500
          '#F97316', // orange-500
        ],
        borderWidth: 0,
      },
    ],
  };

  const monthlyData = {
    labels: mockMonthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: mockMonthlyData.map(item => item.income),
        backgroundColor: '#10B981', // emerald-500
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: mockMonthlyData.map(item => item.expenses),
        backgroundColor: '#EF4444', // red-500
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '70%',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">$4,250.75</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-green-600">$8,450.00</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-800">
                      <span className="sr-only">Increased by</span>12%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-red-600">$4,199.25</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-800">
                      <span className="sr-only">Decreased by</span>8%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Savings Rate</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-purple-600">24.5%</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <span className="sr-only">Increased by</span>3.2%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Income vs Expenses */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Income vs Expenses</h2>
          <div className="h-80">
            <Bar data={monthlyData} options={options} />
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Expenses by Category</h2>
          <div className="h-80">
            <Doughnut data={categoryData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Category Breakdown</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed view of your spending by category</p>
        </div>
        <div className="bg-white overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {mockExpensesByCategory.map((item, index) => (
              <li key={index} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.category}</p>
                    <div className="mt-1 flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.amount / 2000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">${item.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{((item.amount / 2000) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
