const asyncHandler = require('express-async-handler');
const { IncomeTransaction, ExpenseTransaction } = require('../models/transactionModel');

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = asyncHandler(async (req, res) => {
  const { description, amount, type, category, date } = req.body;

  if (!['income', 'expense'].includes(type)) {
    res.status(400);
    throw new Error('Type must be income or expense');
  }

  const Model = type === 'income' ? IncomeTransaction : ExpenseTransaction;

  const transaction = await Model.create({
    user: req.user._id,
    description,
    amount,
    type,
    category,
    date: date || Date.now(),
  });

  if (transaction) {
    res.status(201).json(transaction);
  } else {
    res.status(400);
    throw new Error('Invalid transaction data');
  }
});

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, sort } = req.query;

  // Build base query
  const baseQuery = { user: req.user._id };
  if (category) baseQuery.category = category;
  if (startDate || endDate) {
    baseQuery.date = {};
    if (startDate) baseQuery.date.$gte = new Date(startDate);
    if (endDate) baseQuery.date.$lte = new Date(endDate);
  }

  // Sort options
  let sortBy = { date: -1 };
  if (sort === 'oldest') sortBy = { date: 1 };
  else if (sort === 'highest') sortBy = { amount: -1 };
  else if (sort === 'lowest') sortBy = { amount: 1 };

  // Fetch depending on type
  if (type === 'income') {
    const items = await IncomeTransaction.find({ ...baseQuery, type: 'income' }).sort(sortBy);
    return res.json(items);
  }
  if (type === 'expense') {
    const items = await ExpenseTransaction.find({ ...baseQuery, type: 'expense' }).sort(sortBy);
    return res.json(items);
  }

  // No type filter: fetch both and merge
  const [incomeItems, expenseItems] = await Promise.all([
    IncomeTransaction.find({ ...baseQuery, type: 'income' }),
    ExpenseTransaction.find({ ...baseQuery, type: 'expense' }),
  ]);
  const merged = [...incomeItems, ...expenseItems].sort((a, b) => {
    if (sortBy.date) return sortBy.date * (new Date(b.date) - new Date(a.date));
    if (sortBy.amount) return sortBy.amount * (a.amount - b.amount);
    return 0;
  });
  return res.json(merged);
});

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;
  let transaction = await IncomeTransaction.findOne({ _id: id, user });
  if (!transaction) transaction = await ExpenseTransaction.findOne({ _id: id, user });
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  res.json(transaction);
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const { description, amount, type, category, date } = req.body;
  const id = req.params.id;
  const user = req.user._id;

  // Try finding in both collections
  let transaction = await IncomeTransaction.findOne({ _id: id, user });
  let Model = IncomeTransaction;
  if (!transaction) {
    transaction = await ExpenseTransaction.findOne({ _id: id, user });
    Model = ExpenseTransaction;
  }

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // If type is changing, we need to move document between collections
  if (type && type !== transaction.type) {
    // Remove from current collection and create in the other
    await transaction.remove();
    const NewModel = type === 'income' ? IncomeTransaction : ExpenseTransaction;
    const newDoc = await NewModel.create({
      user,
      description: description ?? transaction.description,
      amount: amount ?? transaction.amount,
      type,
      category: category ?? transaction.category,
      date: date ?? transaction.date,
    });
    return res.json(newDoc);
  }

  // Update in place
  transaction.description = description ?? transaction.description;
  transaction.amount = amount ?? transaction.amount;
  transaction.category = category ?? transaction.category;
  transaction.date = date ?? transaction.date;

  const updatedTransaction = await transaction.save();
  res.json(updatedTransaction);
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = req.user._id;
  let transaction = await IncomeTransaction.findOne({ _id: id, user });
  if (!transaction) transaction = await ExpenseTransaction.findOne({ _id: id, user });
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  await transaction.remove();
  res.json({ message: 'Transaction removed' });
});

// @desc    Get transaction summary
// @route   GET /api/transactions/summary
// @access  Private
const getTransactionSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = { user: req.user._id };
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const [incomeAgg, expenseAgg] = await Promise.all([
    IncomeTransaction.aggregate([
      { $match: { ...match, type: 'income' } },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    ExpenseTransaction.aggregate([
      { $match: { ...match, type: 'expense' } },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
  ]);

  const income = incomeAgg[0] || { total: 0, count: 0 };
  const expense = expenseAgg[0] || { total: 0, count: 0 };

  res.json({
    income: { total: income.total || 0, count: income.count || 0 },
    expense: { total: expense.total || 0, count: expense.count || 0 },
    balance: (income.total || 0) - (expense.total || 0),
  });
});

// @desc    Get transactions by category
// @route   GET /api/transactions/category-summary
// @access  Private
const getCategorySummary = asyncHandler(async (req, res) => {
  const { type, startDate, endDate } = req.query;
  const match = { user: req.user._id };
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  // If a type is provided, aggregate only on that collection
  if (type === 'income') {
    const summary = await IncomeTransaction.aggregate([
      { $match: { ...match, type: 'income' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    return res.json(summary);
  }
  if (type === 'expense') {
    const summary = await ExpenseTransaction.aggregate([
      { $match: { ...match, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    return res.json(summary);
  }

  // No type: aggregate on both and merge
  const [incomeSummary, expenseSummary] = await Promise.all([
    IncomeTransaction.aggregate([
      { $match: { ...match, type: 'income' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    ExpenseTransaction.aggregate([
      { $match: { ...match, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
  ]);

  const map = new Map();
  for (const item of [...incomeSummary, ...expenseSummary]) {
    const existing = map.get(item._id) || { _id: item._id, total: 0, count: 0 };
    existing.total += item.total;
    existing.count += item.count;
    map.set(item._id, existing);
  }
  const merged = Array.from(map.values()).sort((a, b) => b.total - a.total);
  res.json(merged);
});

module.exports = {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getCategorySummary,
};
