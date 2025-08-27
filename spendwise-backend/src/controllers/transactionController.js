const asyncHandler = require('express-async-handler');
const Transaction = require('../models/transactionModel');

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = asyncHandler(async (req, res) => {
  const { description, amount, type, category, date } = req.body;

  const transaction = await Transaction.create({
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
  const query = { user: req.user._id };

  // Filter by type (income/expense)
  if (type) {
    query.type = type;
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Sort
  let sortBy = { date: -1 }; // Default: newest first
  if (sort === 'oldest') {
    sortBy = { date: 1 };
  } else if (sort === 'highest') {
    sortBy = { amount: -1 };
  } else if (sort === 'lowest') {
    sortBy = { amount: 1 };
  }

  const transactions = await Transaction.find(query).sort(sortBy);
  res.json(transactions);
});

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const { description, amount, type, category, date } = req.body;

  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (transaction) {
    transaction.description = description || transaction.description;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.date = date || transaction.date;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (transaction) {
    await transaction.remove();
    res.json({ message: 'Transaction removed' });
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

// @desc    Get transaction summary
// @route   GET /api/transactions/summary
// @access  Private
const getTransactionSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = { user: req.user._id };

  // Filter by date range if provided
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const summary = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert to object with type as key
  const result = summary.reduce((acc, { _id, total, count }) => {
    acc[_id] = { total, count };
    return acc;
  }, {});

  res.json({
    income: result.income || { total: 0, count: 0 },
    expense: result.expense || { total: 0, count: 0 },
    balance: (result.income?.total || 0) - (result.expense?.total || 0),
  });
});

// @desc    Get transactions by category
// @route   GET /api/transactions/category-summary
// @access  Private
const getCategorySummary = asyncHandler(async (req, res) => {
  const { type, startDate, endDate } = req.query;
  const match = { user: req.user._id };

  // Filter by type if provided
  if (type) {
    match.type = type;
  }

  // Filter by date range if provided
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const summary = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  res.json(summary);
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
