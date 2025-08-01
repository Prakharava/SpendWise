export const TRANSACTION_CATEGORIES = {
  expense: [
    'Food & Dining',
    'Shopping',
    'Housing',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Education',
    'Utilities',
    'Travel',
    'Other'
  ],
  income: [
    'Salary',
    'Freelance',
    'Investments',
    'Gifts',
    'Rental',
    'Business',
    'Other Income'
  ]
};

export const getCategoryIcon = (category) => {
  const icons = {
    'Food & Dining': '🍽️',
    'Shopping': '🛍️',
    'Housing': '🏠',
    'Transportation': '🚗',
    'Entertainment': '🎬',
    'Healthcare': '🏥',
    'Education': '📚',
    'Utilities': '💡',
    'Travel': '✈️',
    'Salary': '💰',
    'Freelance': '💼',
    'Investments': '📈',
    'Gifts': '🎁',
    'Rental': '🏢',
    'Business': '💼',
    'Other': '📋',
    'Other Income': '📋'
  };
  
  return icons[category] || '📋';
};
