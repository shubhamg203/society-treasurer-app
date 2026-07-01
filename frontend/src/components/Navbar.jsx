import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Society Treasurer</div>
      <div className="navbar-menu">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/flat-members">Flat Members</Link>
        <Link to="/reports">Reports</Link>
        {user?.role === 'admin' && <Link to="/users">Users</Link>}
      </div>
      <div className="navbar-user">
        <span className="user-badge">{user?.role?.toUpperCase()}</span>
        <span>{user?.username}</span>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

// Made with Bob
