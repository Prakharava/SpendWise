const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Please specify if this is an income or expense'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'food',
        'transportation',
        'housing',
        'utilities',
        'healthcare',
        'entertainment',
        'shopping',
        'education',
        'salary',
        'freelance',
        'investment',
        'other',
      ],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Export two models bound to specific collections
const IncomeTransaction = mongoose.model('IncomeTransaction', transactionSchema, 'transactions');
const ExpenseTransaction = mongoose.model('ExpenseTransaction', transactionSchema, 'expenses');

module.exports = { IncomeTransaction, ExpenseTransaction };
