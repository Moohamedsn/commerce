import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, resolveImageUrl } from '../api';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { t } = useLang();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(res => {
        setProduct(res.data);
        setSelectedVariant(0);
        setSelectedSize('');
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!product) return null;

  const variant = product.variants[selectedVariant];
  const images = variant?.images?.length ? variant.images : [];
  const availableSizes = variant?.sizes?.filter(s => s.stock > 0) || [];

  const handleAddToCart = () => {
    if (!selectedSize) { alert(t.selectSize); return; }
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        productName: product.name,
        color: variant.color,
        size: selectedSize,
        price: product.price,
        quantity,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        {t.back}
      </button>

      <div className="pd-layout">
        {/* Images */}
        <div className="pd-images">
          <div className="pd-main-img">
            {images[activeImg] ? (
              <img src={resolveImageUrl(images[activeImg])} alt={product.name} />
            ) : (
              <div className="pd-img-placeholder">
                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                  <path d="M35 5L10 32H28L25 55L50 28H32L35 5Z" fill="#C9A84C" opacity="0.3"/>
                </svg>
                <span>{t.noImage}</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="pd-thumbnails">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={resolveImageUrl(img)}
                  alt=""
                  className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pd-info">
          <p className="pd-category">{product.category}</p>
          <h1 className="pd-name">{product.name}</h1>
          <p className="pd-price">{product.price.toLocaleString()} <span>DZD</span></p>
          <p className="pd-description">{product.description}</p>

          {/* Color Picker */}
          <div className="pd-section">
            <label className="pd-label">{t.colorLabel} — <strong>{variant?.color}</strong></label>
            <div className="color-options">
              {product.variants.map((v, i) => (
                <button
                  key={i}
                  className={`color-option ${selectedVariant === i ? 'active' : ''}`}
                  style={{ background: v.colorHex || '#333' }}
                  title={v.color}
                  onClick={() => { setSelectedVariant(i); setSelectedSize(''); setActiveImg(0); }}
                />
              ))}
            </div>
          </div>

          {/* Size Picker */}
          <div className="pd-section">
            <label className="pd-label">{t.sizeLabel} {selectedSize && <strong>— {selectedSize}</strong>}</label>
            <div className="size-options">
              {['XS','S','M','L','XL','XXL'].map(size => {
                const sizeData = variant?.sizes?.find(s => s.size === size);
                const inStock = sizeData && sizeData.stock > 0;
                return (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'active' : ''} ${!inStock ? 'out' : ''}`}
                    disabled={!inStock}
                    onClick={() => inStock && setSelectedSize(size)}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {availableSizes.length === 0 && (
              <p className="out-of-stock-msg">{t.outOfStock}</p>
            )}
          </div>

          {/* Quantity */}
          <div className="pd-section">
            <label className="pd-label">{t.quantityLabel}</label>
            <div className="qty-control">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className={`btn btn-primary btn-lg btn-full add-to-cart-btn ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? t.addedToCart : t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
