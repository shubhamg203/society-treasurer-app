import { useState, useEffect } from 'react';
import { flatMembersAPI } from '../utils/api';

function FlatMembers({ user }) {
  const [flatMembers, setFlatMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    flat_number: '',
    owner_name: '',
    contact_number: '',
    email: '',
    monthly_maintenance: '',
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchFlatMembers();
  }, []);

  const fetchFlatMembers = async () => {
    try {
      const response = await flatMembersAPI.getAll();
      setFlatMembers(response.data);
    } catch (err) {
      setError('Failed to load flat members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await flatMembersAPI.update(editingMember.id, formData);
      } else {
        await flatMembersAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchFlatMembers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save flat member');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flat member?')) return;
    
    try {
      await flatMembersAPI.delete(id);
      fetchFlatMembers();
    } catch (err) {
      setError('Failed to delete flat member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      flat_number: member.flat_number,
      owner_name: member.owner_name,
      contact_number: member.contact_number || '',
      email: member.email || '',
      monthly_maintenance: member.monthly_maintenance,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      flat_number: '',
      owner_name: '',
      contact_number: '',
      email: '',
      monthly_maintenance: '',
    });
    setEditingMember(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading flat members...</div>;

  return (
    <div className="dashboard">
      <h1>Flat Members</h1>

      {error && <div className="error">{error}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>All Flat Members</h2>
          {isAdmin && (
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Add Flat Member
            </button>
          )}
        </div>

        {flatMembers.length === 0 ? (
          <div className="empty-state">
            <h3>No flat members found</h3>
            <p>Add your first flat member to get started</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Flat Number</th>
                <th>Owner Name</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Monthly Maintenance</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {flatMembers.map((member) => (
                <tr key={member.id}>
                  <td><strong>{member.flat_number}</strong></td>
                  <td>{member.owner_name}</td>
                  <td>{member.contact_number || '-'}</td>
                  <td>{member.email || '-'}</td>
                  <td style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {formatCurrency(member.monthly_maintenance)}
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }}
                        onClick={() => handleEdit(member)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.5rem 1rem' }}
                        onClick={() => handleDelete(member.id)}
                      >
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
            <h2>{editingMember ? 'Edit Flat Member' : 'Add Flat Member'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Flat Number *</label>
                <input
                  type="text"
                  value={formData.flat_number}
                  onChange={(e) => setFormData({ ...formData, flat_number: e.target.value })}
                  required
                  disabled={editingMember !== null}
                />
              </div>

              <div className="form-group">
                <label>Owner Name *</label>
                <input
                  type="text"
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Monthly Maintenance *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monthly_maintenance}
                  onChange={(e) => setFormData({ ...formData, monthly_maintenance: e.target.value })}
                  required
                />
              </div>

              <div className="btn-group">
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'Update' : 'Add'} Flat Member
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

export default FlatMembers;

// Made with Bob
