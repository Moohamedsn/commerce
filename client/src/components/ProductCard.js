import React from 'react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../api';
import { useLang } from '../context/LangContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { t } = useLang();
  const firstVariant = product.variants?.[0];
  const firstImage = firstVariant?.images?.[0];
  const colorCount = product.variants?.length || 0;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-img">
        {firstImage ? (
          <img src={resolveImageUrl(firstImage)} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
              <path d="M35 5L10 32H28L25 55L50 28H32L35 5Z" fill="#C9A84C" opacity="0.4"/>
            </svg>
          </div>
        )}
        <div className="product-card-overlay">
          <span>{t.shopNow}</span>
        </div>
      </div>
      <div className="product-card-info">
        <div className="product-card-colors">
          {product.variants?.map((v, i) => (
            <span
              key={i}
              className="color-dot"
              style={{ background: v.colorHex || '#333' }}
              title={v.color}
            />
          ))}
        </div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-footer">
          <span className="product-card-price">{product.price.toLocaleString()} DZD</span>
          <span className="product-card-variants">{colorCount} {colorCount !== 1 ? t.colors : t.color}</span>
        </div>
      </div>
    </Link>
  );
}
