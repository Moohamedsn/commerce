import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import './Cart.css';

export default function Cart() {
  const { cart, dispatch, total } = useCart();
  const navigate = useNavigate();
  const { t } = useLang();

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty container">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <h2>{t.cartEmpty}</h2>
        <p>{t.cartEmptyDesc}</p>
        <Link to="/" className="btn btn-primary">{t.shopNow}</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="section-title">{t.yourCart} <span>{t.cartTitle2}</span></h1>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.key} className="cart-item">
              <div className="cart-item-img">
                <svg viewBox="0 0 60 60" fill="none" width="30" height="30">
                  <path d="M35 5L10 32H28L25 55L50 28H32L35 5Z" fill="#C9A84C" opacity="0.4"/>
                </svg>
              </div>
              <div className="cart-item-info">
                <h3>{item.productName}</h3>
                <p>{item.color} · {t.size} {item.size}</p>
                <p className="cart-item-price">{item.price.toLocaleString()} DZD</p>
              </div>
              <div className="cart-item-actions">
                <div className="qty-control-sm">
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { key: item.key, quantity: Math.max(1, item.quantity - 1) } })}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { key: item.key, quantity: item.quantity + 1 } })}>+</button>
                </div>
                <button className="remove-btn" onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.key })}>
                  ✕
                </button>
              </div>
              <div className="cart-item-subtotal">
                {(item.price * item.quantity).toLocaleString()} DZD
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2>{t.orderSummary}</h2>
          <div className="summary-row">
            <span>{t.subtotal}</span>
            <span>{total.toLocaleString()} DZD</span>
          </div>
          <div className="summary-row">
            <span>{t.livraison}</span>
            <span className="text-muted">{t.calcAtCheckout}</span>
          </div>
          <div className="divider" />
          <div className="summary-row total-row">
            <span>{t.total}</span>
            <span>{total.toLocaleString()} DZD +</span>
          </div>
          <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate('/checkout')}>
            {t.proceedToCheckout}
          </button>
          <Link to="/" className="btn btn-dark btn-full" style={{ marginTop: 10 }}>
            {t.continueShopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
