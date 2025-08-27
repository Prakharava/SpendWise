import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, ArrowUpIcon, ArrowDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import TransactionModal from '../components/TransactionModal';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate summary from transactions
  const calculateSummary = useCallback(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += parseFloat(transaction.amount);
        } else {
          acc.expenses += parseFloat(transaction.amount);
        }
        acc.balance = acc.income - acc.expenses;
        return acc;
      },
      { balance: 0, income: 0, expenses: 0 }
    );
  }, [transactions]);

  const [summary, setSummary] = useState(calculateSummary());

  // Update summary when transactions change
  useEffect(() => {
    setSummary(calculateSummary());
  }, [transactions, calculateSummary]);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        setTransactions(savedTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
        toast.error('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Save transactions to localStorage when they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const handleAddTransaction = (newTransaction) => {
    const transactionWithId = {
      ...newTransaction,
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd')
    };
    
    setTransactions(prev => [transactionWithId, ...prev]);
    toast.success('Transaction added successfully');
    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      toast.success('Transaction deleted');
    }
  };

  const filteredTransactions = activeTab === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === activeTab);

  return (
    <div className="min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name || 'User'}</span>
            {/* <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button> */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Balance */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                    <dd className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">
                        ₹{summary.balance.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </p>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Income */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <ArrowDownIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Income</dt>
                    <dd className="flex items-baseline">
                      <p className="text-2xl font-semibold text-green-600">
                        +₹{summary.income.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </p>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <ArrowUpIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Expenses</dt>
                    <dd className="flex items-baseline">
                      <p className="text-2xl font-semibold text-red-600">
                        -₹{summary.expenses.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </p>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Add Transaction Button */}
          <div className="bg-white overflow-hidden shadow rounded-lg flex items-center justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    activeTab === 'all' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('income')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'income' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setActiveTab('expense')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    activeTab === 'expense' 
                      ? 'bg-red-100 text-red-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Expenses
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden">
            {filteredTransactions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <li key={transaction.id} className="py-3 group px-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpIcon className="h-5 w-5" />
                          ) : (
                            <ArrowDownIcon className="h-5 w-5" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </p>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete transaction"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-gray-500">No transactions found</p>
              </div>
            )}
          </div>
          
          {filteredTransactions.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Link
                to="/transactions"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all transactions
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Transaction Modal */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTransaction}
      />
    </div>
  );
};

export default Dashboard;
