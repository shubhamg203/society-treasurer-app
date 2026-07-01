import { useState, useEffect } from 'react';
import { reportsAPI } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Reports() {
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [maintenanceStatus, setMaintenanceStatus] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const COLORS = ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6', '#1abc9c'];

  useEffect(() => {
    fetchReports();
  }, [selectedMonth, selectedYear]);

  const fetchReports = async () => {
    try {
      const [expenseRes, maintenanceRes, monthlyRes] = await Promise.all([
        reportsAPI.getExpenseSummary(),
        reportsAPI.getMaintenanceStatus(selectedMonth, selectedYear),
        reportsAPI.getMonthlySummary(selectedYear),
      ]);

      setExpenseSummary(expenseRes.data);
      setMaintenanceStatus(maintenanceRes.data);
      setMonthlySummary(monthlyRes.data);
    } catch (err) {
      setError('Failed to load reports');
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

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const paidCount = maintenanceStatus.filter(m => m.paid).length;
  const unpaidCount = maintenanceStatus.filter(m => !m.paid).length;

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="dashboard">
      <h1>Reports</h1>

      {error && <div className="error">{error}</div>}

      {/* Month/Year Selector */}
      <div className="filters">
        <div className="filters-grid">
          <div className="form-group">
            <label>Month</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expense Summary by Category */}
      <div className="table-container" style={{ marginBottom: '2rem' }}>
        <div className="table-header">
          <h2>Expense Summary by Category</h2>
        </div>
        {expenseSummary.length === 0 ? (
          <div className="empty-state">
            <h3>No expense data available</h3>
          </div>
        ) : (
          <>
            <div style={{ padding: '2rem' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseSummary}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.category}: ${formatCurrency(entry.total)}`}
                  >
                    {expenseSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenseSummary.map((item, index) => (
                  <tr key={index}>
                    <td style={{ textTransform: 'capitalize' }}>{item.category}</td>
                    <td style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: '#ecf0f1', fontWeight: 'bold' }}>
                  <td>Total</td>
                  <td style={{ color: '#e74c3c' }}>
                    {formatCurrency(expenseSummary.reduce((sum, item) => sum + item.total, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Maintenance Payment Status */}
      <div className="table-container" style={{ marginBottom: '2rem' }}>
        <div className="table-header">
          <h2>Maintenance Payment Status - {getMonthName(selectedMonth)} {selectedYear}</h2>
        </div>
        <div className="stats-grid" style={{ padding: '1.5rem' }}>
          <div className="stat-card positive">
            <h3>Paid</h3>
            <div className="value" style={{ color: '#27ae60' }}>{paidCount}</div>
          </div>
          <div className="stat-card negative">
            <h3>Unpaid</h3>
            <div className="value" style={{ color: '#e74c3c' }}>{unpaidCount}</div>
          </div>
          <div className="stat-card">
            <h3>Total Collected</h3>
            <div className="value" style={{ color: '#27ae60' }}>
              {formatCurrency(maintenanceStatus.filter(m => m.paid).reduce((sum, m) => sum + m.amount_paid, 0))}
            </div>
          </div>
          <div className="stat-card">
            <h3>Total Pending</h3>
            <div className="value" style={{ color: '#e74c3c' }}>
              {formatCurrency(maintenanceStatus.filter(m => !m.paid).reduce((sum, m) => sum + m.monthly_maintenance, 0))}
            </div>
          </div>
        </div>
        {maintenanceStatus.length === 0 ? (
          <div className="empty-state">
            <h3>No flat members found</h3>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Flat Number</th>
                <th>Owner Name</th>
                <th>Monthly Maintenance</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceStatus.map((member, index) => (
                <tr key={index}>
                  <td><strong>{member.flat_number}</strong></td>
                  <td>{member.owner_name}</td>
                  <td>{formatCurrency(member.monthly_maintenance)}</td>
                  <td>
                    <span className={`badge ${member.paid ? 'badge-success' : 'badge-danger'}`}>
                      {member.paid ? 'PAID' : 'UNPAID'}
                    </span>
                  </td>
                  <td>
                    {member.payment_date
                      ? new Date(member.payment_date).toLocaleDateString('en-IN')
                      : '-'}
                  </td>
                  <td style={{ fontWeight: 'bold', color: member.paid ? '#27ae60' : '#e74c3c' }}>
                    {formatCurrency(member.amount_paid)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Monthly Income vs Expense */}
      <div className="table-container">
        <div className="table-header">
          <h2>Monthly Income vs Expense - {selectedYear}</h2>
        </div>
        {monthlySummary.length === 0 ? (
          <div className="empty-state">
            <h3>No data available</h3>
          </div>
        ) : (
          <>
            <div style={{ padding: '2rem' }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlySummary}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickFormatter={(month) => getMonthName(month)} />
                  <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(month) => getMonthName(month)}
                  />
                  <Legend />
                  <Bar dataKey="credits" fill="#27ae60" name="Income" />
                  <Bar dataKey="debits" fill="#e74c3c" name="Expense" />
                  <Bar dataKey="net" fill="#3498db" name="Net" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Income</th>
                  <th>Expense</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {monthlySummary.map((item) => (
                  <tr key={item.month}>
                    <td><strong>{getMonthName(item.month)}</strong></td>
                    <td style={{ color: '#27ae60', fontWeight: 'bold' }}>
                      {formatCurrency(item.credits)}
                    </td>
                    <td style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                      {formatCurrency(item.debits)}
                    </td>
                    <td style={{ color: item.net >= 0 ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                      {formatCurrency(item.net)}
                    </td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: '#ecf0f1', fontWeight: 'bold' }}>
                  <td>Total</td>
                  <td style={{ color: '#27ae60' }}>
                    {formatCurrency(monthlySummary.reduce((sum, item) => sum + item.credits, 0))}
                  </td>
                  <td style={{ color: '#e74c3c' }}>
                    {formatCurrency(monthlySummary.reduce((sum, item) => sum + item.debits, 0))}
                  </td>
                  <td style={{ color: monthlySummary.reduce((sum, item) => sum + item.net, 0) >= 0 ? '#27ae60' : '#e74c3c' }}>
                    {formatCurrency(monthlySummary.reduce((sum, item) => sum + item.net, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;

// Made with Bob
