import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import './Navbar.css';

export default function Navbar() {
  const { count } = useCart();
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
            <path d="M35 5L10 32H28L25 55L50 28H32L35 5Z" fill="#C9A84C"/>
          </svg>
          <span>EDGE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">{t.shop}</Link>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Language Switcher */}
          <div className="lang-switcher">
            {['fr', 'ar', 'en'].map(l => (
              <button
                key={l}
                className={`lang-btn ${lang === l ? 'active' : ''}`}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="cart-btn" onClick={() => navigate('/cart')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>{t.shop}</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>{t.cart} ({count})</Link>
        </div>
      )}
    </nav>
  );
}
