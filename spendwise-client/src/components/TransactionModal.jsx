import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const categories = [
  { id: 'food', name: 'Food & Drinks' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'transportation', name: 'Transportation' },
  { id: 'housing', name: 'Housing' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'salary', name: 'Salary' },
  { id: 'freelance', name: 'Freelance' },
  { id: 'investment', name: 'Investment' },
  { id: 'other', name: 'Other' },
];

const TransactionModal = ({ isOpen, onClose, onSave, transaction = null }) => {
  const isEditing = !!transaction;
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(transaction?.type || 'expense');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: transaction?.description || '',
      amount: transaction?.amount || '',
      category: transaction?.category || '',
      date: transaction?.date || new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data) => {
    try {
      onSave({
        ...data,
        amount: parseFloat(data.amount),
        type: type,
        category: data.category || 'other'
      });
      toast.success(isEditing ? 'Transaction updated successfully!' : 'Transaction added successfully!');
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Failed to save transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                      {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
                    </Dialog.Title>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Transaction Type Toggle */}
                        <div className="flex rounded-md shadow-sm">
                          <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${
                              type === 'expense'
                                ? 'bg-red-100 text-red-700 border-red-200 border-t border-b border-l'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            Expense
                          </button>
                          <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${
                              type === 'income'
                                ? 'bg-green-100 text-green-700 border-green-200 border-t border-b border-r'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            Income
                          </button>
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="description"
                              className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-gray-100 ${
                                errors.description ? 'border-red-300' : 'border-gray-300'
                              }`}
                              {...register('description', { required: 'Description is required' })}
                            />
                            {errors.description && (
                              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Amount
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              id="amount"
                              step="0.01"
                              min="0.01"
                              className={`block w-full pl-7 pr-12 sm:text-sm border rounded-md dark:bg-gray-900 dark:text-gray-100 ${
                                errors.amount ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="0.00"
                              {...register('amount', {
                                required: 'Amount is required',
                                min: { value: 0.01, message: 'Amount must be greater than 0' },
                              })}
                            />
                          </div>
                          {errors.amount && (
                            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                          )}
                        </div>

                        {/* Category */}
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category
                          </label>
                          <select
                            id="category"
                            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border dark:bg-gray-900 dark:text-gray-100 ${
                              errors.category ? 'border-red-300' : 'border-gray-300'
                            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                            defaultValue=""
                            {...register('category', { required: 'Category is required' })}
                          >
                            <option value="" disabled>
                              Select a category
                            </option>
                            {categories
                              .filter(cat => 
                                (type === 'income' && ['salary', 'freelance', 'investment', 'other'].includes(cat.id)) ||
                                (type === 'expense' && !['salary', 'freelance', 'investment'].includes(cat.id))
                              )
                              .map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                          </select>
                          {errors.category && (
                            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                          )}
                        </div>

                        {/* Date */}
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              id="date"
                              className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-gray-100 ${
                                errors.date ? 'border-red-300' : 'border-gray-300'
                              }`}
                              {...register('date', { required: 'Date is required' })}
                            />
                            {errors.date && (
                              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              'Saving...'
                            ) : isEditing ? (
                              'Update Transaction'
                            ) : (
                              'Add Transaction'
                            )}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={onClose}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default TransactionModal;
