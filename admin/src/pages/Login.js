import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await login(email, password);
      loginAdmin(res.data.token, res.data.admin);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <svg viewBox="0 0 60 60" fill="none" width="48" height="48">
            <path d="M35 5L10 32H28L25 55L50 28H32L35 5Z" fill="#C9A84C"/>
          </svg>
          <h1>EDGE</h1>
          <p>Admin Control Panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@edge.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="......." />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
