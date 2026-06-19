import React, { useEffect, useState } from 'react';
import { getOrderStats, getOrders } from '../api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const STAT_CARDS = [
  { key: 'total', label: 'Total Orders', color: '#C9A84C', icon: '📦' },
  { key: 'pending', label: 'Pending', color: '#FFC107', icon: '⏳' },
  { key: 'confirmed', label: 'Confirmed', color: '#2196F3', icon: '✓' },
  { key: 'shipped', label: 'Shipped', color: '#9C27B0', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', color: '#43A047', icon: '✅' },
  { key: 'canceled', label: 'Canceled', color: '#E53935', icon: '✕' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([getOrderStats(), getOrders({ limit: 8 })])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.orders);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <span className="live-badge">● LIVE</span>
      </div>

      {/* Revenue Banner */}
      <div className="revenue-banner">
        <div>
          <p className="revenue-label">Total Revenue (Confirmed+)</p>
          <h2 className="revenue-amount">{stats?.revenue?.toLocaleString() || 0} DZD</h2>
        </div>
        <svg viewBox="0 0 60 60" fill="none" width="48" height="48" opacity="0.3">
          <path d="M35 5L10 32H28L25 55L50 28H32L35 5Z" fill="#C9A84C"/>
        </svg>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {STAT_CARDS.map(card => (
          <div className="stat-card" key={card.key} style={{ '--accent': card.color }}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-value">{stats?.[card.key] ?? 0}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="recent-orders card">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/orders" className="btn btn-dark btn-sm">View All</Link>
        </div>
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Wilaya</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="empty-row">No orders yet</td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.customerName}</strong>
                      <small>{order.customerPhone}</small>
                    </td>
                    <td>{order.wilayaName}</td>
                    <td>{order.items?.length} item(s)</td>
                    <td className="gold">{order.total?.toLocaleString()} DZD</td>
                    <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
