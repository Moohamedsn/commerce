import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { getWilayas, placeOrder } from '../api';
import './Checkout.css';

export default function Checkout() {
  const { cart, total, dispatch } = useCart();
  const navigate = useNavigate();
  const { t } = useLang();

  const [wilayas, setWilayas] = useState([]);
  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    wilayaId: '',
    commune: '',
    address: '',
    deliveryType: 'home',
    notes: '',
  });

  useEffect(() => {
    if (cart.items.length === 0) { navigate('/cart'); return; }
    setLoading(true);
    getWilayas()
      .then(res => setWilayas(res.data))
      .finally(() => setLoading(false));
  }, [cart.items.length, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'wilayaId') {
      // FIX: use w.id (SQL) not w._id (MongoDB)
      const w = wilayas.find(w => String(w.id) === String(value));
      setSelectedWilaya(w || null);
      setForm(prev => ({ ...prev, wilayaId: value, commune: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const livraisonPrice = selectedWilaya
    ? (form.deliveryType === 'home' ? selectedWilaya.livraisonDomicile : selectedWilaya.livraisonBureau)
    : 0;

  const orderTotal = total + livraisonPrice;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.wilayaId) { setError(t.selectWilayaError); return; }
    if (!form.commune) { setError(t.selectCommuneError); return; }

    setSubmitting(true);
    setError('');

    try {
      const orderData = {
        ...form,
        items: cart.items.map(i => ({
          product: i.productId,
          productName: i.productName,
          color: i.color,
          size: i.size,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
      };

      const res = await placeOrder(orderData);
      dispatch({ type: 'CLEAR_CART' });
      navigate('/order-success', { state: { orderId: res.data.orderId } });
    } catch (err) {
      setError(err.response?.data?.message || t.failedOrder);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="checkout-page container">
      <h1 className="section-title">{t.checkout}</h1>

      <form onSubmit={handleSubmit} className="checkout-layout">
        {/* Left: Form */}
        <div className="checkout-form">

          {/* Personal Info */}
          <div className="checkout-section">
            <h2 className="checkout-section-title">{t.personalInfo}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{t.fullName} *</label>
                <input
                  type="text" name="customerName" value={form.customerName}
                  onChange={handleChange} required placeholder="Your Name"
                />
              </div>
              <div className="form-group">
                <label>{t.phoneNumber} *</label>
                <input
                  type="tel" name="customerPhone" value={form.customerPhone}
                  onChange={handleChange} required placeholder="0555 123 456"
                />
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="checkout-section">
            <h2 className="checkout-section-title">{t.deliveryInfo}</h2>

            {/* Delivery Type */}
            <div className="form-group">
              <label>{t.deliveryType} *</label>
              <div className="delivery-type-options">
                <label className={`delivery-type-card ${form.deliveryType === 'home' ? 'active' : ''}`}>
                  <input
                    type="radio" name="deliveryType" value="home"
                    checked={form.deliveryType === 'home'} onChange={handleChange}
                  />
                  <div className="delivery-type-content">
                    <span className="delivery-icon">🏠</span>
                    <div>
                      <strong>{t.homeDelivery}</strong>
                      <small>{t.homeDeliveryDesc}</small>
                    </div>
                    {selectedWilaya && (
                      <span className="delivery-price">{selectedWilaya.livraisonDomicile.toLocaleString()} DZD</span>
                    )}
                  </div>
                </label>
                <label className={`delivery-type-card ${form.deliveryType === 'office' ? 'active' : ''}`}>
                  <input
                    type="radio" name="deliveryType" value="office"
                    checked={form.deliveryType === 'office'} onChange={handleChange}
                  />
                  <div className="delivery-type-content">
                    <span className="delivery-icon">🏪</span>
                    <div>
                      <strong>{t.officePickup}</strong>
                      <small>{t.officePickupDesc}</small>
                    </div>
                    {selectedWilaya && (
                      <span className="delivery-price">{selectedWilaya.livraisonBureau.toLocaleString()} DZD</span>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Wilaya */}
            <div className="form-group">
              <label>{t.wilaya} *</label>
              <select name="wilayaId" value={form.wilayaId} onChange={handleChange} required>
                <option value="">{t.selectWilaya}</option>
                {wilayas.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.code.toString().padStart(2, '0')} - {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Commune */}
            <div className="form-group">
              <label>{t.commune} *</label>
              <select name="commune" value={form.commune} onChange={handleChange} required disabled={!selectedWilaya}>
                <option value="">{t.selectCommune}</option>
                {selectedWilaya?.communes?.map((c, i) => (
                  <option key={c.id || i} value={c.name}>{c.name}</option>
                ))}
              </select>
              {!selectedWilaya && <small className="form-hint">{t.selectWilayaFirst}</small>}
            </div>

            {/* Address */}
            <div className="form-group">
              <label>{t.fullAddress} *</label>
              <input
                type="text" name="address" value={form.address}
                onChange={handleChange} required
                placeholder={t.addressPlaceholder}
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label>{t.orderNotes}</label>
              <textarea
                name="notes" value={form.notes} onChange={handleChange}
                rows={3} placeholder={t.notesPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="checkout-summary">
          <h2>{t.orderSummary}</h2>

          <div className="checkout-items">
            {cart.items.map(item => (
              <div key={item.key} className="checkout-item">
                <div className="checkout-item-info">
                  <strong>{item.productName}</strong>
                  <small>{item.color} · {t.size} {item.size} · x{item.quantity}</small>
                </div>
                <span className="checkout-item-price">
                  {(item.price * item.quantity).toLocaleString()} DZD
                </span>
              </div>
            ))}
          </div>

          <div className="divider" />

          <div className="summary-row">
            <span>{t.subtotal}</span>
            <span>{total.toLocaleString()} DZD</span>
          </div>
          <div className="summary-row">
            <span>{t.livraison} ({form.deliveryType === 'home' ? t.homeDelivery : t.officePickup})</span>
            <span>{selectedWilaya ? `${livraisonPrice.toLocaleString()} DZD` : '—'}</span>
          </div>
          <div className="divider" />
          <div className="summary-row total-row">
            <span>{t.total}</span>
            <span>{selectedWilaya ? `${orderTotal.toLocaleString()} DZD` : `${total.toLocaleString()}+ DZD`}</span>
          </div>

          {error && <div className="checkout-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={submitting}
          >
            {submitting ? t.placingOrder : t.placeOrder}
          </button>
        </div>
      </form>
    </div>
  );
}
