const Expense = require('../models/Expense');
const Group = require('../models/Group');
const Activity = require('../models/Activity');

exports.addExpense = async (req, res) => {
  const { description, amount, category } = req.body;
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const expense = await Expense.create({
      group: groupId,
      description,
      amount,
      category,
      paidBy: req.user._id,
    });

    await Activity.create({
      userId: req.user._id,
      groupId: group._id,
      description: `You added an expense "${description}" of ₹${amount} in group "${group.name}"`,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error('[Add Expense Error]', err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};


exports.deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });

    if (expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this expense' });
    }

    await Activity.create({
      userId: req.user._id,
      groupId: expense.group,
      description: `You deleted the expense "${expense.description}" (₹${expense.amount})`,
    });

    await expense.deleteOne();

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('[Delete Expense Error]', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'username');

    res.json(expenses);
  } catch (err) {
    console.error('[Get Expenses Error]', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

exports.getBalances = async (req, res) => {
  const { groupId } = req.params;

  try {
    const expenses = await Expense.find({ groupId });
    const group = await Group.findById(groupId);
    const members = group.members.map(id => id.toString());

    const balance = {};
    members.forEach(id => (balance[id] = 0));

    expenses.forEach(exp => {
      const share = exp.amount / members.length;
      members.forEach(id => {
        if (id === exp.paidBy.toString()) {
          balance[id] += exp.amount - share;
        } else {
          balance[id] -= share;
        }
      });
    });

    res.json(balance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate balances' });
  }
};
