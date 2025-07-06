const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  addExpense,
  getExpenses,
  deleteExpense,
} = require('../controllers/expenseController');

const router = express.Router();

router.post('/:groupId', auth, addExpense);

router.get('/:groupId', auth, getExpenses);

router.delete('/:expenseId', auth, deleteExpense);

module.exports = router;
