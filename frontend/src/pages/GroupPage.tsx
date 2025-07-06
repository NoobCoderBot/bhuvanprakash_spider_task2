import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GroupPage: React.FC = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [userId, setUserId] = useState('');
  const token = localStorage.getItem('token');

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroup(res.data);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error('Failed to fetch group:', err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`/api/expenses/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(res.data._id);
    } catch (err) {
      console.error('Failed to fetch user info');
    }
  };

  const handleAddExpense = async () => {
    try {
      await axios.post(
        `/api/expenses/${groupId}`,
        {
          description,
          amount: parseFloat(amount),
          category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDescription('');
      setAmount('');
      setCategory('');
      fetchExpenses();
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await axios.delete(`/api/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.error('Failed to delete expense');
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;

    try {
      await axios.delete(`/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete group');
    }
  };

  useEffect(() => {
    fetchUser();
    fetchGroup();
    fetchExpenses();
  }, [groupId]);

  if (!group) return <div className="ml-64 p-6 text-white">Loading group...</div>;

  return (
    <div className="ml-64 p-6 min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">{group.name}</h2>

      {/* Delete Group Button */}
      {group.creator === userId && (
        <button
          onClick={handleDeleteGroup}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mb-6"
        >
          Delete Group
        </button>
      )}

      {/* Group Members */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Group Members</h3>
        {members.length === 0 ? (
          <p className="text-gray-400">No members found.</p>
        ) : (
          <ul className="list-disc ml-6 text-gray-300">
            {members.map((member: any) => (
              <li key={member._id}>{member.username}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Expense */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Expense</h3>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
        />
        <button
          onClick={handleAddExpense}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </div>

      
      <div>
        <h3 className="text-lg font-semibold mb-2">Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-400">No expenses yet.</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li key={expense._id} className="bg-gray-800 p-3 rounded">
                <div className="font-medium">{expense.description}</div>
                <div className="text-sm text-gray-400">
                  ₹{expense.amount} • {expense.category}
                </div>
                <div className="text-sm text-gray-400">
                  Paid by{' '}
                  <span className="text-white font-medium">
                    {expense.paidBy?.username || 'Unknown'}
                  </span>
                  <br />
                  Split: ₹{(expense.amount / members.length).toFixed(2)} per member
                </div>
                {expense.paidBy?._id === userId && (
                  <button
                    onClick={() => handleDeleteExpense(expense._id)}
                    className="mt-2 text-red-500 hover:text-red-600 text-sm underline"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
