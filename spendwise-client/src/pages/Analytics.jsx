// import { useState, useEffect } from 'react';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';
// import { getCategorySummary, getSummary, getTransactions } from '../services/transactionService';

// // Register ChartJS components
// ChartJS.register(ArcElement, Tooltip, Legend, Title);

// // Helper map to display friendly names for categories stored as ids in DB
// const CATEGORY_LABELS = {
//   food: 'Food & Drinks',
//   shopping: 'Shopping',
//   transportation: 'Transportation',
//   housing: 'Housing',
//   utilities: 'Utilities',
//   entertainment: 'Entertainment',
//   healthcare: 'Healthcare',
//   education: 'Education',
//   salary: 'Salary',
//   freelance: 'Freelance',
//   investment: 'Investment',
//   other: 'Other',
// };

// const Analytics = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [categorySummary, setCategorySummary] = useState([]); 
//   const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  
//   // Fetch expense category summary and overall summary from backend (all-time)
//   useEffect(() => {
//     const fetchAll = async () => {
//       setIsLoading(true);
//       try {
//         // Request all-time data (omit date filters)
//         const params = { type: 'expense' };

//         const [categoryRes, summaryRes] = await Promise.all([
//           getCategorySummary(params),
//           getSummary({}),
//         ]);
        
//         if (process.env.NODE_ENV !== 'production') {
          
//           console.log('Category summary (raw):', categoryRes);
          
//           console.log('Summary (raw):', summaryRes);
//         }
        
//         let mapped = (Array.isArray(categoryRes) ? categoryRes : [])
//           .filter(item => item && item._id)
//           .map(item => ({
//             id: item._id,
//             label: CATEGORY_LABELS[item._id] || String(item._id),
//             amount: Number(item.total) || 0,
//             count: Number(item.count) || 0,
//           }))
//           .sort((a, b) => a.label.localeCompare(b.label));
//         // Fallback: if backend returns no category data, aggregate on client from transactions
//         if (mapped.length === 0) {
//           const tx = await getTransactions({ type: 'expense' });
//           const agg = new Map();
//           for (const t of Array.isArray(tx) ? tx : []) {
//             const cat = t.category || 'other';
//             const prev = agg.get(cat) || { id: cat, label: CATEGORY_LABELS[cat] || String(cat), amount: 0, count: 0 };
//             prev.amount += Number(t.amount) || 0;
//             prev.count += 1;
//             agg.set(cat, prev);
//           }
//           mapped = Array.from(agg.values()).sort((a, b) => a.label.localeCompare(b.label));
//         }
//         setCategorySummary(mapped);
//         if (summaryRes && typeof summaryRes === 'object') {
//           setSummary({
//             totalIncome: Number(summaryRes.income?.total) || 0,
//             totalExpense: Number(summaryRes.expense?.total) || 0,
//             balance: Number(summaryRes.balance) || 0,
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching analytics data:', error);
//         setCategorySummary([]);
//         setSummary({ totalIncome: 0, totalExpense: 0, balance: 0 });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAll();
//   }, []);

//   const categoryData = {
//     labels: categorySummary.map(item => item.label),
//     datasets: [
//       {
//         data: categorySummary.map(item => item.amount),
//         backgroundColor: [
//           '#3B82F6',
//           '#10B981',
//           '#F59E0B',
//           '#EF4444',
//           '#8B5CF6',
//           '#EC4899',
//           '#14B8A6',
//           '#F97316',
//           '#22C55E',
//           '#06B6D4',
//           '#A855F7',
//           '#F43F5E',
//         ].slice(0, categorySummary.length),
//         borderWidth: 0,
//       },
//     ],
//   };

  

//   const doughnutOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'bottom',
//       },
//     },
//     cutout: '70%',
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-10">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview of your income, expenses, and spending patterns</p>
//         </div>
//         <div />
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-transparent dark:border-gray-700">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
//                 <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Balance</dt>
//                   <dd className="flex items-baseline">
//                     <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">₹{summary.balance.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-transparent dark:border-gray-700">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
//                 <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                 </svg>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Income</dt>
//                   <dd className="flex items-baseline">
//                     <div className="text-2xl font-semibold text-green-600">₹{summary.totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
//                     {/* <div className="ml-2 flex items-baseline text-sm font-semibold text-green-800">
//                       <span className="sr-only">Increased by</span>12%
//                     </div> */}
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-transparent dark:border-gray-700">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
//                 <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
//                 </svg>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Expenses</dt>
//                   <dd className="flex items-baseline">
//                     <div className="text-2xl font-semibold text-red-600">₹{summary.totalExpense.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-transparent dark:border-gray-700">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
//                 <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Savings Rate</dt>
//                   <dd className="flex items-baseline">
//                     <div className="text-2xl font-semibold text-purple-600">{(() => {
//                       const income = Number(summary.totalIncome) || 0;
//                       const expense = Number(summary.totalExpense) || 0;
//                       const rate = income > 0 ? ((income - expense) / income) * 100 : 0;
//                       return `${rate.toFixed(1)}%`;
//                     })()}</div>
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         {/* Expenses by Category */}
//         <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Expenses by Category</h2>
//           <div className="h-80">
//             <Doughnut data={categoryData} options={doughnutOptions} />
//           </div>
//         </div>
//       </div>

//       {/* Category Breakdown */}
//       <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow overflow-hidden sm:rounded-xl border border-gray-100 dark:border-gray-700">
//         <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
//           <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-gray-100">Category Breakdown</h3>
//           <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Detailed view of your spending by category</p>
//         </div>
//         <div className="bg-white dark:bg-gray-800/0 overflow-hidden">
//           {categorySummary.length === 0 ? (
//             <div className="px-6 py-12 text-center">
//               <div className="mx-auto h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm7.28-2.03a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.5-4.5a.75.75 0 1 0-1.06-1.06L11.25 11.69l-1.72-1.72Z" clipRule="evenodd" /></svg>
//               </div>
//               <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No expense data found.</p>
//             </div>
//           ) : (
//           <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//             {categorySummary.map((item, index) => (
//               <li key={index} className="px-6 py-4">
//                 <div className="flex items-center">
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2">
//                       <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden="true"></span>
//                       <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.label}</p>
//                       <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 text-xs font-medium">
//                         {(() => { const total = categorySummary.reduce((s, i) => s + i.amount, 0); return total ? ((item.amount / total) * 100).toFixed(1) : '0.0'; })()}%
//                       </span>
//                     </div>
//                     <div className="mt-2 flex items-center">
//                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//                         <div 
//                           className="bg-blue-600 h-3 rounded-full transition-all" 
//                           style={{ width: `${(item.amount / Math.max(1, Math.max(...categorySummary.map(c => c.amount)))) * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="ml-4 flex-shrink-0 text-right">
//                     <p className="text-base font-semibold text-gray-900 dark:text-gray-100">₹{item.amount.toFixed(2)}</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;



import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getCategorySummary, getSummary, getTransactions } from '../services/transactionService';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CATEGORY_LABELS = {
  food: 'Food & Drinks',
  shopping: 'Shopping',
  transportation: 'Transportation',
  housing: 'Housing',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  healthcare: 'Healthcare',
  education: 'Education',
  salary: 'Salary',
  freelance: 'Freelance',
  investment: 'Investment',
  other: 'Other',
};

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categorySummary, setCategorySummary] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const params = { type: 'expense' };
        const [categoryRes, summaryRes] = await Promise.all([
          getCategorySummary(params),
          getSummary({}),
        ]);

        let mapped = (Array.isArray(categoryRes) ? categoryRes : [])
          .filter(item => item && item._id)
          .map(item => ({
            id: item._id,
            label: CATEGORY_LABELS[item._id] || String(item._id),
            amount: Number(item.total) || 0,
            count: Number(item.count) || 0,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        if (mapped.length === 0) {
          const tx = await getTransactions({ type: 'expense' });
          const agg = new Map();
          for (const t of Array.isArray(tx) ? tx : []) {
            const cat = t.category || 'other';
            const prev = agg.get(cat) || { id: cat, label: CATEGORY_LABELS[cat] || String(cat), amount: 0, count: 0 };
            prev.amount += Number(t.amount) || 0;
            prev.count += 1;
            agg.set(cat, prev);
          }
          mapped = Array.from(agg.values()).sort((a, b) => a.label.localeCompare(b.label));
        }
        setCategorySummary(mapped);

        if (summaryRes && typeof summaryRes === 'object') {
          setSummary({
            totalIncome: Number(summaryRes.income?.total) || 0,
            totalExpense: Number(summaryRes.expense?.total) || 0,
            balance: Number(summaryRes.balance) || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setCategorySummary([]);
        setSummary({ totalIncome: 0, totalExpense: 0, balance: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const categoryData = {
    labels: categorySummary.map(item => item.label),
    datasets: [
      {
        data: categorySummary.map(item => item.amount),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
          '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
          '#22C55E', '#06B6D4', '#A855F7', '#F43F5E',
        ].slice(0, categorySummary.length),
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9CA3AF', padding: 15 },
      },
    },
    cutout: '70%',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">📊 Analytics</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track your income, expenses, and savings patterns</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Balance', value: `₹${summary.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: 'blue', icon: '💰' },
          { title: 'Total Income', value: `₹${summary.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: 'green', icon: '📈' },
          { title: 'Total Expenses', value: `₹${summary.totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: 'red', icon: '💸' },
          { title: 'Savings Rate', value: `${((summary.totalIncome - summary.totalExpense) / (summary.totalIncome || 1) * 100).toFixed(1)}%`, color: 'purple', icon: '🏦' },
        ].map((card, idx) => (
          <div key={idx} className={`bg-gradient-to-br from-${card.color}-50 to-${card.color}-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow hover:shadow-lg transition-all`}>
            <div className="p-6 flex flex-col items-start space-y-2">
              <span className="text-2xl">{card.icon}</span>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</h3>
              <p className={`text-xl font-bold text-${card.color}-700 dark:text-${card.color}-400`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow hover:shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Expenses by Category</h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut data={categoryData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow hover:shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Category Breakdown</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">See where your money goes</p>
        </div>
        <div>
          {categorySummary.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                ❌
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No expense data found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {categorySummary.map((item, idx) => (
                <li key={idx} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                      <div className="w-40 bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all"
                          style={{ width: `${(item.amount / Math.max(...categorySummary.map(c => c.amount))) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">₹{item.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">({((item.amount / categorySummary.reduce((s, i) => s + i.amount, 0)) * 100).toFixed(1)}%)</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
