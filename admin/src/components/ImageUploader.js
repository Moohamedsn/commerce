import React, { useState, useRef, useCallback } from 'react';
import { uploadImages, deleteImage } from '../api';
import './ImageUploader.css';

/**
 * ImageUploader
 * Props:
 *   images   — string[]  (current URLs / paths)
 *   onChange — (images: string[]) => void
 */
export default function ImageUploader({ images = [], onChange }) {
  const [dragging, setDragging]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState({});   // { tmpId: 0-100 }
  const [previews, setPreviews]   = useState([]);   // { tmpId, objectUrl }
  const inputRef = useRef();

  const BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://edge-prnl.onrender.com';

  const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http')) return src;
    return BASE + src;
  };

  const processFiles = useCallback(async (files) => {
    if (!files.length) return;
    setUploading(true);

    // Build local previews immediately
    const newPreviews = files.map(f => ({
      tmpId: Math.random().toString(36).slice(2),
      objectUrl: URL.createObjectURL(f),
      file: f,
    }));
    setPreviews(prev => [...prev, ...newPreviews]);

    // Animate fake progress per file
    newPreviews.forEach(p => {
      let pct = 0;
      const tick = setInterval(() => {
        pct = Math.min(pct + Math.random() * 18, 90);
        setProgress(prev => ({ ...prev, [p.tmpId]: Math.round(pct) }));
      }, 120);
      p._tick = tick;
    });

    try {
      const res = await uploadImages(files);
      const uploadedUrls = res.data.urls;

      // Finish progress
      newPreviews.forEach(p => {
        clearInterval(p._tick);
        setProgress(prev => ({ ...prev, [p.tmpId]: 100 }));
      });

      // Revoke object URLs after a tick
      setTimeout(() => {
        newPreviews.forEach(p => URL.revokeObjectURL(p.objectUrl));
        setPreviews(prev => prev.filter(p => !newPreviews.find(np => np.tmpId === p.tmpId)));
        setProgress(prev => {
          const next = { ...prev };
          newPreviews.forEach(p => delete next[p.tmpId]);
          return next;
        });
      }, 600);

      onChange([...images, ...uploadedUrls]);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
      newPreviews.forEach(p => {
        clearInterval(p._tick);
        URL.revokeObjectURL(p.objectUrl);
      });
      setPreviews(prev => prev.filter(p => !newPreviews.find(np => np.tmpId === p.tmpId)));
    } finally {
      setUploading(false);
    }
  }, [images, onChange]);

  const onDrop = useCallback(e => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    processFiles(files);
  }, [processFiles]);

  const onPick = e => {
    const files = Array.from(e.target.files);
    processFiles(files);
    e.target.value = '';
  };

  const handleRemove = async (url) => {
    // Remove from UI immediately
    onChange(images.filter(img => img !== url));
    // Best-effort delete on server (only for /uploads/* paths)
    if (url.startsWith('/uploads/')) {
      try { await deleteImage(url); } catch (_) {}
    }
  };

  const moveImage = (from, to) => {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="img-uploader">
      {/* Drop Zone */}
      <div
        className={`img-dropzone ${dragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={onPick}
        />
        <div className="dropzone-content">
          <div className={`dropzone-icon ${dragging ? 'bounce' : ''}`}>
            {dragging ? '📂' : uploading ? '⏳' : '🖼️'}
          </div>
          <p className="dropzone-title">
            {dragging ? 'Release to upload' : uploading ? 'Uploading…' : 'Drop images here'}
          </p>
          <p className="dropzone-sub">or <span className="dropzone-link">browse files</span> · PNG, JPG, WEBP up to 10 MB</p>
        </div>
      </div>

      {/* Uploading Previews (in-progress) */}
      {previews.length > 0 && (
        <div className="img-grid">
          {previews.map(p => (
            <div key={p.tmpId} className="img-tile uploading-tile">
              <img src={p.objectUrl} alt="uploading" />
              <div className="img-progress-overlay">
                <div className="img-progress-bar" style={{ width: `${progress[p.tmpId] || 0}%` }} />
                <span className="img-progress-pct">{progress[p.tmpId] || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="img-grid">
          {images.map((url, i) => (
            <div
              key={url}
              className="img-tile"
              draggable
              onDragStart={e => e.dataTransfer.setData('idx', i)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.stopPropagation(); moveImage(Number(e.dataTransfer.getData('idx')), i); }}
            >
              <img src={resolveUrl(url)} alt={`img-${i}`} />
              <div className="img-tile-overlay">
                {i === 0 && <span className="img-main-badge">Main</span>}
                <div className="img-tile-actions">
                  {i > 0 && (
                    <button
                      type="button"
                      className="img-action-btn"
                      title="Set as main"
                      onClick={() => moveImage(i, 0)}
                    >⭐</button>
                  )}
                  <button
                    type="button"
                    className="img-action-btn danger"
                    title="Remove"
                    onClick={() => handleRemove(url)}
                  >✕</button>
                </div>
              </div>
              <div className="img-drag-handle" title="Drag to reorder">⠿</div>
            </div>
          ))}
          {/* Add more slot */}
          <div
            className="img-tile img-add-tile"
            onClick={() => inputRef.current.click()}
          >
            <span className="img-add-icon">+</span>
            <span className="img-add-label">Add more</span>
          </div>
        </div>
      )}
    </div>
  );
}
