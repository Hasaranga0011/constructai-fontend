import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authStore } from '../store/authStore';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = authStore.user;

  const handleLogout = () => {
    authStore.logout();
    globalThis.window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">🏗️ ConstructAI</span>
        </Link>

        <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">
            Dashboard
          </Link>
          <Link to="/projects" className="nav-link">
            Projects
          </Link>

          <div className="nav-user">
            <span className="user-name">{user?.full_name || user?.username}</span>
            <span className="user-role">{user?.role}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
