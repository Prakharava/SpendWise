const express = require('express');
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getCategorySummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// Transaction routes
router
  .route('/')
  .post(addTransaction)
  .get(getTransactions);

// Transaction summary routes
router.get('/summary', getTransactionSummary);
router.get('/category-summary', getCategorySummary);

// Single transaction routes
router
  .route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
