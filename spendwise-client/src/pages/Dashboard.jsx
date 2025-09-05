import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, ArrowUpIcon, ArrowDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import TransactionModal from '../components/TransactionModal';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { getTransactions as apiGetTransactions, addTransaction as apiAddTransaction, deleteTransaction as apiDeleteTransaction } from '../services/transactionService';

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

  // Load transactions from backend on mount
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await apiGetTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to load transactions:', error);
        toast.error(error.response?.data?.message || 'Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // No longer persisting to localStorage; all data comes from backend

  const handleAddTransaction = async (newTransaction) => {
    try {
      // Ensure date is in ISO format; backend accepts date or defaults to now
      const payload = {
        ...newTransaction,
        date: newTransaction.date || format(new Date(), 'yyyy-MM-dd'),
      };
      const created = await apiAddTransaction(payload);
      setTransactions(prev => [created, ...prev]);
      toast.success('Transaction added successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await apiDeleteTransaction(id);
      setTransactions(prev => prev.filter(tx => (tx._id || tx.id) !== id));
      toast.success('Transaction deleted');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error(error.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const filteredTransactions = activeTab === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === activeTab);

  return (
    <div className="min-h-full">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Quick overview of your finances</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user?.name || 'User'}</span>
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Balance */}
          <div className="bg-white dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-600 rounded-xl p-3 text-white shadow-sm">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Balance</dt>
                    <dd className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        ₹{summary.balance.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </p>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Income */}
          <div className="bg-white dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-600 rounded-xl p-3 text-white shadow-sm">
                  <ArrowDownIcon className="h-6 w-6" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Income</dt>
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
          <div className="bg-white dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-600 rounded-xl p-3 text-white shadow-sm">
                  <ArrowUpIcon className="h-6 w-6" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Expenses</dt>
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
          <div className="bg-white dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center border border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow overflow-hidden sm:rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-gray-100">Recent Transactions</h3>
              <div className="flex rounded-lg p-1 bg-gray-100 dark:bg-gray-700">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                    activeTab === 'all' 
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('income')}
                  className={`ml-1 px-3 py-1.5 text-sm font-medium rounded-md transition ${
                    activeTab === 'income' 
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setActiveTab('expense')}
                  className={`ml-1 px-3 py-1.5 text-sm font-medium rounded-md transition ${
                    activeTab === 'expense' 
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600'
                  }`}
                >
                  Expenses
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800/0 overflow-hidden">
            {filteredTransactions.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <li key={transaction._id || transaction.id} className="py-3 group px-4 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2.5 rounded-xl shadow-sm ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpIcon className="h-5 w-5" />
                          ) : (
                            <ArrowDownIcon className="h-5 w-5" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{transaction.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category} • {transaction.date?.slice(0,10)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </p>
                        <button
                          onClick={() => handleDeleteTransaction(transaction._id)}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <div className="px-6 py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 mb-3">💳</div>
                <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
              </div>
            )}
          </div>
          
          {filteredTransactions.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30">
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
