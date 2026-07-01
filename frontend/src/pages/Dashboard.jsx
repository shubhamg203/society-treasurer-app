import { useState, useEffect } from 'react';
import { dashboardAPI } from '../utils/api';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await dashboardAPI.getSummary();
      setSummary(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!summary) return null;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card positive">
          <h3>Current Balance</h3>
          <div className="value">{formatCurrency(summary.current_balance)}</div>
        </div>

        <div className="stat-card">
          <h3>Total Income</h3>
          <div className="value" style={{ color: '#27ae60' }}>
            {formatCurrency(summary.total_credits)}
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Expenses</h3>
          <div className="value" style={{ color: '#e74c3c' }}>
            {formatCurrency(summary.total_debits)}
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Flats</h3>
          <div className="value">{summary.total_flats}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>This Month Income</h3>
          <div className="value" style={{ color: '#27ae60' }}>
            {formatCurrency(summary.month_credits)}
          </div>
        </div>

        <div className="stat-card">
          <h3>This Month Expenses</h3>
          <div className="value" style={{ color: '#e74c3c' }}>
            {formatCurrency(summary.month_debits)}
          </div>
        </div>

        <div className="stat-card">
          <h3>This Month Net</h3>
          <div className="value" style={{ color: summary.month_credits - summary.month_debits >= 0 ? '#27ae60' : '#e74c3c' }}>
            {formatCurrency(summary.month_credits - summary.month_debits)}
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Recent Transactions</h2>
        </div>
        {summary.recent_transactions.length === 0 ? (
          <div className="empty-state">
            <h3>No transactions yet</h3>
            <p>Start by adding your first transaction</p>
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
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {summary.recent_transactions.map((transaction) => (
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
                  <td style={{ color: transaction.transaction_type === 'credit' ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                    {transaction.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

// Made with Bob
