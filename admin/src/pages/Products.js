import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api';
import ImageUploader from '../components/ImageUploader';
import './Products.css';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const emptyVariant = () => ({
  color: '', colorHex: '#000000',
  images: [],
  sizes: SIZES.map(s => ({ size: s, stock: 0 })),
});
const emptyProduct = () => ({
  name: '', description: '', price: '', category: 'T-Shirt',
  variants: [emptyVariant()], isActive: true,
});

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http')) return src;
    return BASE + src;
  };

  const fetch = () => getProducts().then(r => setProducts(r.data)).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(emptyProduct()); setEditingId(null); setShowForm(true); setError(''); };
  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description || '', price: p.price,
      category: p.category || 'T-Shirt', isActive: p.isActive,
      variants: p.variants.map(v => ({
        color: v.color, colorHex: v.colorHex || '#000000',
        images: v.images?.length ? v.images : [],
        sizes: SIZES.map(s => {
          const found = v.sizes?.find(x => x.size === s);
          return { size: s, stock: found?.stock ?? 0 };
        }),
      })),
    });
    setEditingId(p.id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    fetch();
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { setError('Name and price are required'); return; }
    setSaving(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price) };
      editingId ? await updateProduct(editingId, payload) : await createProduct(payload);
      setShowForm(false);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // Variant helpers
  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, emptyVariant()] }));
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));
  const updateVariant = (i, field, value) => setForm(f => ({
    ...f,
    variants: f.variants.map((v, idx) => idx === i ? { ...v, [field]: value } : v),
  }));
  const updateSize = (vi, si, value) => setForm(f => ({
    ...f,
    variants: f.variants.map((v, idx) => idx === vi ? {
      ...v,
      sizes: v.sizes.map((s, sidx) => sidx === si ? { ...s, stock: Number(value) } : s),
    } : v),
  }));

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      {/* Products Grid */}
      <div className="products-admin-grid">
        {products.length === 0 && <p className="empty-state">No products yet.</p>}
        {products.map(p => (
          <div key={p.id} className={`product-admin-card ${!p.isActive ? 'inactive' : ''}`}>
            <div className="pac-image">
              {p.variants?.[0]?.images?.[0] ? (
                <img src={resolveUrl(p.variants[0].images[0])} alt={p.name} />
              ) : (
                <div className="pac-placeholder">
                  <svg viewBox="0 0 60 60" fill="none" width="32" height="32">
                    <path d="M35 5L10 32H28L25 55L50 28H32L35 5Z" fill="#C9A84C" opacity="0.3"/>
                  </svg>
                </div>
              )}
              {!p.isActive && <span className="inactive-badge">Hidden</span>}
            </div>
            <div className="pac-info">
              <h3>{p.name}</h3>
              <p className="pac-price">{Number(p.price).toLocaleString()} DZD</p>
              <div className="pac-variants">
                {p.variants?.map((v, i) => (
                  <span key={i} className="pac-color" style={{ background: v.colorHex || '#333' }} title={v.color} />
                ))}
              </div>
            </div>
            <div className="pac-actions">
              <button className="btn btn-dark btn-sm" onClick={() => openEdit(p)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal-body">

              {/* Basic Info */}
              <div className="form-row-2">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="EDGE Raglan Tee" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option>T-Shirt</option><option>Hoodie</option><option>Shorts</option><option>Tracksuit</option><option>Accessories</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Price (DZD) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="2500" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))}>
                    <option value="true">Active (visible)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description..." />
              </div>

              {/* Variants */}
              <div className="variants-section">
                <div className="variants-header">
                  <h3>Color Variants</h3>
                  <button type="button" className="btn btn-dark btn-sm" onClick={addVariant}>+ Add Color</button>
                </div>

                {form.variants.map((v, vi) => (
                  <div key={vi} className="variant-card">
                    <div className="variant-card-header">
                      <strong>Color {vi + 1}</strong>
                      {form.variants.length > 1 && (
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeVariant(vi)}>Remove</button>
                      )}
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Color Name</label>
                        <input value={v.color} onChange={e => updateVariant(vi, 'color', e.target.value)} placeholder="Navy/White" />
                      </div>
                      <div className="form-group">
                        <label>Color Hex</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input type="color" value={v.colorHex} onChange={e => updateVariant(vi, 'colorHex', e.target.value)} style={{ width: 50, padding: 2, cursor: 'pointer' }} />
                          <input value={v.colorHex} onChange={e => updateVariant(vi, 'colorHex', e.target.value)} placeholder="#000000" />
                        </div>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                      <label>
                        Product Images
                        <span className="label-hint"> — drag to reorder · first image = main photo</span>
                      </label>
                      <ImageUploader
                        images={v.images}
                        onChange={imgs => updateVariant(vi, 'images', imgs)}
                      />
                    </div>

                    {/* Sizes & Stock */}
                    <div className="form-group">
                      <label>Stock per Size</label>
                      <div className="sizes-grid">
                        {v.sizes.map((s, si) => (
                          <div key={si} className="size-stock-item">
                            <span className="size-label">{s.size}</span>
                            <input
                              type="number" min="0" value={s.stock}
                              onChange={e => updateSize(vi, si, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && <div className="form-error">{error}</div>}
            </div>

            <div className="modal-footer">
              <button className="btn btn-dark" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
