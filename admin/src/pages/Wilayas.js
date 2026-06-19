import React, { useEffect, useState } from 'react';
import { getWilayas, bulkUpdateWilayas } from '../api';
import './Wilayas.css';

export default function Wilayas() {
  const [wilayas, setWilayas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getWilayas()
      .then(res => setWilayas(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (id, field, value) => {
    setChanges(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: Number(value) },
    }));
  };

  const getValue = (wilaya, field) => {
    if (changes[wilaya.id]?.[field] !== undefined) return changes[wilaya.id][field];
    return wilaya[field];
  };

  const handleSave = async () => {
    const updates = Object.entries(changes).map(([id, vals]) => {
      const w = wilayas.find(w => String(w.id) === String(id));
      return {
        id,
        livraisonDomicile: vals.livraisonDomicile ?? w.livraisonDomicile,
        livraisonBureau: vals.livraisonBureau ?? w.livraisonBureau,
      };
    });
    if (updates.length === 0) return;
    setSaving(true);
    try {
      await bulkUpdateWilayas(updates);
      setWilayas(prev => prev.map(w => {
        const c = changes[w.id];
        if (!c) return w;
        return { ...w, ...c };
      }));
      setChanges({});
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSetAll = (field, value) => {
    const newChanges = {};
    wilayas.forEach(w => {
      newChanges[w.id] = { ...changes[w.id], [field]: Number(value) };
    });
    setChanges(newChanges);
  };

  const filtered = wilayas.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.code.toString().includes(search)
  );
  const changedCount = Object.keys(changes).length;

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="wilayas-page">
      <div className="page-header">
        <h1>Livraison Prices</h1>
        {changedCount > 0 && (
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : `Save ${changedCount} Change${changedCount > 1 ? 's' : ''}`}
          </button>
        )}
        {saved && <span className="save-success">✓ Saved!</span>}
      </div>

      {/* Bulk Set */}
      <div className="bulk-set card">
        <h3>Set Price for All Wilayas</h3>
        <div className="bulk-inputs">
          <div>
            <label>🏠 Home Delivery (all)</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" placeholder="e.g. 600" id="bulkHome" style={{ flex: 1, padding: '8px 12px', background: '#1A1A1A', border: '1px solid #333', borderRadius: 6, color: '#f5f5f5', fontFamily: 'inherit' }} />
              <button className="btn btn-dark btn-sm" onClick={() => handleSetAll('livraisonDomicile', document.getElementById('bulkHome').value)}>Apply</button>
            </div>
          </div>
          <div>
            <label>🏪 Office Pickup (all)</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" placeholder="e.g. 400" id="bulkOffice" style={{ flex: 1, padding: '8px 12px', background: '#1A1A1A', border: '1px solid #333', borderRadius: 6, color: '#f5f5f5', fontFamily: 'inherit' }} />
              <button className="btn btn-dark btn-sm" onClick={() => handleSetAll('livraisonBureau', document.getElementById('bulkOffice').value)}>Apply</button>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="wilaya-search">
        <input
          type="text"
          placeholder="Search wilaya by name or code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Table */}
      <div className="wilayas-table-wrap card">
        <table className="wilayas-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Wilaya</th>
              <th>🏠 Home Delivery (DZD)</th>
              <th>🏪 Office Pickup (DZD)</th>
              <th>Changed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => {
              const isChanged = !!changes[w.id];
              return (
                <tr key={w.id} className={isChanged ? 'changed-row' : ''}>
                  <td className="code-cell">{w.code.toString().padStart(2, '0')}</td>
                  <td>
                    <strong>{w.name}</strong>
                    {w.nameAr && <small>{w.nameAr}</small>}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="price-input"
                      value={getValue(w, 'livraisonDomicile')}
                      onChange={e => handleChange(w.id, 'livraisonDomicile', e.target.value)}
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="price-input"
                      value={getValue(w, 'livraisonBureau')}
                      onChange={e => handleChange(w.id, 'livraisonBureau', e.target.value)}
                      min="0"
                    />
                  </td>
                  <td>{isChanged ? <span className="changed-badge">●</span> : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
