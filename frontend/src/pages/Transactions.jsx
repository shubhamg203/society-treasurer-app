import { useState, useEffect } from 'react';
import { transactionsAPI, flatMembersAPI } from '../utils/api';

function Transactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [flatMembers, setFlatMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    flat_member_id: '',
  });

  const [formData, setFormData] = useState({
    transaction_type: 'credit',
    category: 'maintenance',
    amount: '',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    reference_number: '',
    flat_member_id: '',
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchTransactions();
    fetchFlatMembers();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const response = await transactionsAPI.getAll(filters);
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlatMembers = async () => {
    try {
      const response = await flatMembersAPI.getAll();
      setFlatMembers(response.data);
    } catch (err) {
      console.error('Failed to load flat members');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await transactionsAPI.update(editingTransaction.id, formData);
      } else {
        await transactionsAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save transaction');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await transactionsAPI.delete(id);
      fetchTransactions();
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      transaction_type: transaction.transaction_type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description || '',
      transaction_date: transaction.transaction_date.split('T')[0],
      payment_method: transaction.payment_method || 'cash',
      reference_number: transaction.reference_number || '',
      flat_member_id: transaction.flat_member_id || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      transaction_type: 'credit',
      category: 'maintenance',
      amount: '',
      description: '',
      transaction_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      reference_number: '',
      flat_member_id: '',
    });
    setEditingTransaction(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <div className="loading">Loading transactions...</div>;

  return (
    <div className="dashboard">
      <h1>Transactions</h1>

      {error && <div className="error">{error}</div>}

      <div className="filters">
        <div className="filters-grid">
          <div className="form-group">
            <label>Type</label>
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All</option>
              <option value="maintenance">Maintenance</option>
              <option value="cleaning">Cleaning</option>
              <option value="repair">Repair</option>
              <option value="utility">Utility</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Flat</label>
            <select value={filters.flat_member_id} onChange={(e) => setFilters({ ...filters, flat_member_id: e.target.value })}>
              <option value="">All</option>
              {flatMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.flat_number} - {member.owner_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>All Transactions</h2>
          {isAdmin && (
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Add Transaction
            </button>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <h3>No transactions found</h3>
            <p>Add your first transaction to get started</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Flat</th>
                <th>Payment Method</th>
                <th>Amount</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.transaction_date)}</td>
                  <td>
                    <span className={`badge ${transaction.transaction_type === 'credit' ? 'badge-success' : 'badge-danger'}`}>
                      {transaction.transaction_type.toUpperCase()}
                    </span>
                  </td>
                  <td>{transaction.category}</td>
                  <td>{transaction.description || '-'}</td>
                  <td>{transaction.flat_number || '-'}</td>
                  <td>{transaction.payment_method || '-'}</td>
                  <td style={{ color: transaction.transaction_type === 'credit' ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                    {transaction.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }} onClick={() => handleEdit(transaction)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={() => handleDelete(transaction.id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Transaction Type *</label>
                <select
                  value={formData.transaction_type}
                  onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                  required
                >
                  <option value="credit">Credit (Income)</option>
                  <option value="debit">Debit (Expense)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="repair">Repair</option>
                  <option value="utility">Utility</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Transaction Date *</label>
                <input
                  type="date"
                  value={formData.transaction_date}
                  onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              <div className="form-group">
                <label>Reference Number</label>
                <input
                  type="text"
                  value={formData.reference_number}
                  onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                />
              </div>

              {formData.category === 'maintenance' && (
                <div className="form-group">
                  <label>Flat Member</label>
                  <select
                    value={formData.flat_member_id}
                    onChange={(e) => setFormData({ ...formData, flat_member_id: e.target.value })}
                  >
                    <option value="">Select Flat</option>
                    {flatMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.flat_number} - {member.owner_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="btn-group">
                <button type="submit" className="btn btn-primary">
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;

// Made with Bob
