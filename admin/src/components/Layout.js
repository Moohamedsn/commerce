import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const NAV = [
  { to: '/', label: 'Dashboard', icon: '◈', end: true },
  { to: '/orders', label: 'Orders', icon: '📦' },
  { to: '/products', label: 'Products', icon: '👕' },
  { to: '/wilayas', label: 'Livraison Prices', icon: '🗺️' },
];

export default function Layout() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logoutAdmin(); navigate('/login'); };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <svg viewBox="0 0 60 60" fill="none" width="24" height="24">
            <path d="M35 5L10 32H28L25 55L50 28H32L35 5Z" fill="#C9A84C"/>
          </svg>
          <span>EDGE Admin</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">A</div>
            <div>
              <p className="admin-name">Admin</p>
              <p className="admin-email">{admin?.email}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="main-area">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="topbar-title">EDGE Control Panel</span>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
