import React, { useEffect, useState, useCallback } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '../api';
import './Orders.css';

const STATUSES = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'canceled'];

function printOrder(order) {
  const date = new Date(order.createdAt).toLocaleDateString('fr-DZ', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const deliveryLabel = order.deliveryType === 'home' ? '🏠 Domicile' : '🏪 Bureau';

  const itemsRows = (order.items || []).map(item => `
    <tr>
      <td>${item.productName}</td>
      <td>${item.color} — Taille ${item.size}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">${item.unitPrice.toLocaleString()} DZD</td>
      <td style="text-align:right"><strong>${(item.unitPrice * item.quantity).toLocaleString()} DZD</strong></td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Commande #${order.id} — ${order.customerName}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #111; padding: 32px; max-width: 780px; margin: auto; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #111; }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo svg { width: 36px; height: 36px; }
    .logo-name { font-size: 22px; font-weight: 900; letter-spacing: 3px; }
    .logo-sub { font-size: 10px; letter-spacing: 2px; color: #888; text-transform: uppercase; }
    .order-meta { text-align: right; }
    .order-meta h2 { font-size: 18px; font-weight: 700; }
    .order-meta p { font-size: 12px; color: #666; margin-top: 4px; }

    /* Status badge */
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 6px; }
    .status-pending   { background: #FFF3CD; color: #856404; }
    .status-confirmed { background: #CFE2FF; color: #0A4D8C; }
    .status-shipped   { background: #E8D5F5; color: #6A1B9A; }
    .status-delivered { background: #D4EDDA; color: #155724; }
    .status-canceled  { background: #F8D7DA; color: #721C24; }

    /* Info grid */
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
    .info-box { background: #f9f9f9; border-radius: 8px; padding: 16px 18px; }
    .info-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #888; margin-bottom: 10px; font-weight: 600; }
    .info-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; border-bottom: 1px solid #eee; }
    .info-row:last-child { border-bottom: none; }
    .info-row span:first-child { color: #666; }
    .info-row span:last-child { font-weight: 600; text-align: right; max-width: 60%; }

    /* Items table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead th { background: #111; color: #fff; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; }
    tbody tr { border-bottom: 1px solid #eee; }
    tbody tr:last-child { border-bottom: none; }
    tbody td { padding: 11px 12px; vertical-align: middle; }

    /* Totals */
    .totals { margin-left: auto; width: 260px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .total-row.divider { border-top: 1px solid #ddd; margin-top: 6px; padding-top: 10px; }
    .total-row.grand { font-size: 16px; font-weight: 800; border-top: 2px solid #111; margin-top: 6px; padding-top: 10px; }

    /* Notes */
    .notes-box { background: #fffbea; border-left: 3px solid #C9A84C; padding: 10px 14px; border-radius: 4px; margin-top: 20px; font-size: 12px; color: #555; }

    /* Footer */
    .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #ddd; text-align: center; font-size: 11px; color: #aaa; }

    @media print {
      body { padding: 16px; }
      @page { margin: 1cm; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="logo">
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35 5L10 32H28L25 55L50 28H32L35 5Z" fill="#C9A84C"/>
      </svg>
      <div>
        <div class="logo-name">EDGE</div>
        <div class="logo-sub">Sportswear</div>
      </div>
    </div>
    <div class="order-meta">
      <h2>Commande #${order.id}</h2>
      <p>${date}</p>
      <span class="status-badge status-${order.status}">${order.status}</span>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <h3>Client</h3>
      <div class="info-row"><span>Nom</span><span>${order.customerName}</span></div>
      <div class="info-row"><span>Téléphone</span><span>${order.customerPhone}</span></div>
    </div>
    <div class="info-box">
      <h3>Livraison</h3>
      <div class="info-row"><span>Type</span><span>${deliveryLabel}</span></div>
      <div class="info-row"><span>Wilaya</span><span>${order.wilayaName}</span></div>
      <div class="info-row"><span>Commune</span><span>${order.commune}</span></div>
      <div class="info-row"><span>Adresse</span><span>${order.address}</span></div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Produit</th>
        <th>Variante</th>
        <th style="text-align:center">Qté</th>
        <th style="text-align:right">Prix unitaire</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row"><span>Sous-total</span><span>${order.subtotal?.toLocaleString()} DZD</span></div>
    <div class="total-row"><span>Livraison (${deliveryLabel})</span><span>${order.livraisonPrice?.toLocaleString()} DZD</span></div>
    <div class="total-row grand"><span>TOTAL</span><span>${order.total?.toLocaleString()} DZD</span></div>
  </div>

  ${order.notes ? `<div class="notes-box"><strong>Notes :</strong> ${order.notes}</div>` : ''}

  <div class="footer">
    EDGE Sportswear &nbsp;|&nbsp; Imprimé le ${new Date().toLocaleDateString('fr-DZ')} à ${new Date().toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' })}
  </div>

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(() => {
    const params = filter !== 'all' ? { status: filter } : {};
    getOrders(params)
      .then(res => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };
  const handleDelete = async (orderId) => {
  if (!window.confirm('Are you sure you want to delete this order? This cannot be undone.')) return;
  try {
    await deleteOrder(orderId);
    setOrders(prev => prev.filter(o => o.id !== orderId));
  } catch (err) {
    alert('Failed to delete order');
  }
};

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn btn-dark btn-sm" onClick={fetchOrders}>↻ Refresh</button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {STATUSES.map(s => (
          <button
            key={s}
            className={`filter-tab ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader" style={{ minHeight: 300 }}><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="empty-state">No orders found</div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className={`order-card ${expandedId === order.id ? 'expanded' : ''}`}>
              {/* Order Header */}
              <div className="order-header" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                <div className="order-header-left">
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                  <div className="order-customer">
                    <strong>{order.customerName}</strong>
                    <span>{order.customerPhone}</span>
                  </div>
                </div>
                <div className="order-header-right">
                  <span className="order-wilaya">{order.wilayaName} · {order.commune}</span>
                  <span className="order-total">{order.total?.toLocaleString()} DZD</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString('fr-DZ')}</span>
                  {/* Print button — stop propagation so it doesn't toggle expand */}
                  <button
                    className="print-btn"
                    title="Print order"
                    onClick={e => { e.stopPropagation(); printOrder(order); }}
                  >
                    🖨️
                  </button>
                  <span className="expand-icon">{expandedId === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === order.id && (
                <div className="order-details">
                  <div className="order-details-grid">
                    {/* Items */}
                    <div>
                      <h4>Items Ordered</h4>
                      <div className="order-items-list">
                        {order.items?.map((item, i) => (
                          <div key={i} className="order-item-row">
                            <div>
                              <strong>{item.productName}</strong>
                              <small>{item.color} · Size {item.size}</small>
                            </div>
                            <div className="order-item-price">
                              <span>×{item.quantity}</span>
                              <strong>{(item.unitPrice * item.quantity).toLocaleString()} DZD</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                      <h4>Delivery Info</h4>
                      <div className="info-list">
                        <div className="info-row"><span>Type</span><strong>{order.deliveryType === 'home' ? '🏠 Home' : '🏪 Office'}</strong></div>
                        <div className="info-row"><span>Wilaya</span><strong>{order.wilayaName}</strong></div>
                        <div className="info-row"><span>Commune</span><strong>{order.commune}</strong></div>
                        <div className="info-row"><span>Address</span><strong>{order.address}</strong></div>
                        <div className="info-row"><span>Livraison</span><strong>{order.livraisonPrice?.toLocaleString()} DZD</strong></div>
                        {order.notes && <div className="info-row"><span>Notes</span><strong>{order.notes}</strong></div>}
                      </div>

                      {/* Pricing */}
                      <div className="order-pricing">
                        <div className="price-row"><span>Subtotal</span><span>{order.subtotal?.toLocaleString()} DZD</span></div>
                        <div className="price-row"><span>Livraison</span><span>{order.livraisonPrice?.toLocaleString()} DZD</span></div>
                        <div className="price-row total"><span>Total</span><span>{order.total?.toLocaleString()} DZD</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Status + Print Buttons */}
                  <div className="status-actions">
                    <span className="status-label">Update Status:</span>
                    {['pending','confirmed','shipped','delivered','canceled'].map(s => (
                      <button
                        key={s}
                        className={`status-btn status-btn-${s} ${order.status === s ? 'current' : ''}`}
                        onClick={() => handleStatusChange(order.id, s)}
                        disabled={updating === order.id || order.status === s}
                      >
                        {updating === order.id ? '...' : s}
                      </button>
                    ))}
                    <button
                      className="btn btn-dark btn-sm print-action-btn"
                      onClick={() => printOrder(order)}
                    >
                      🖨️ Print Order
                    </button>
                    <button
                      className="print-btn"
                      title="Delete order"
                      onClick={e => { e.stopPropagation(); handleDelete(order.id); }}
                    >
                     🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
