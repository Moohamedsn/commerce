import React, { useEffect, useState } from 'react';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';
import { useLang } from '../context/LangContext';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLang();

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(() => setError(t.failedToLoad))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">{t.newCollection}</div>
          <h1 className="hero-title">
            {t.heroTitle1}<br />
            <span className="gold">{t.heroTitle2}</span>
          </h1>
          <p className="hero-subtitle">{t.heroSubtitle}</p>
          <a href="#products" className="btn btn-primary btn-lg">{t.shopNow}</a>
        </div>
        <div className="hero-decoration">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M120 10L30 110H90L80 190L170 90H110L120 10Z" fill="#C9A84C" opacity="0.08"/>
            <path d="M110 30L40 110H90L82 170L155 90H105L110 30Z" fill="#C9A84C" opacity="0.06"/>
          </svg>
        </div>
      </section>

      {/* Products */}
      <section className="products-section container" id="products">
        <div className="products-header">
          <h2 className="section-title">{t.latestDrops} <span>{t.latestDrops2}</span></h2>
          <p className="text-muted">{t.premiumPieces}</p>
        </div>

        {loading && (
          <div className="loader">
            <div className="spinner" />
          </div>
        )}

        {error && <p className="error-msg">{error}</p>}

        {!loading && !error && (
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="empty-state">
                <p>{t.noProducts}</p>
              </div>
            ) : (
              products.map(p => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        )}
      </section>
    </div>
  );
}
