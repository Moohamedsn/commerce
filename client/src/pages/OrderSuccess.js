import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const { t } = useLang();

  return (
    <div className="success-page container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>{t.orderPlaced}</h1>
        <p>{t.thankYou}</p>
        {orderId && (
          <div className="order-id-badge">
            {t.orderId}: <strong>{orderId}</strong>
          </div>
        )}
        <div className="success-info">
          <div className="info-item">
            <span className="info-icon">📞</span>
            <p>{t.callConfirm}</p>
          </div>
          <div className="info-item">
            <span className="info-icon">⚡</span>
            <p>{t.processed24h}</p>
          </div>
        </div>
        <Link to="/" className="btn btn-primary btn-lg">
          {t.continueShopping}
        </Link>
      </div>
    </div>
  );
}
