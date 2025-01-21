import React, { useState, useEffect } from 'react';
import './ImageWithFallback.css';

const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setLoading(true);
    setError(false);
  }, [src]);

  return (
    <div className={`image-container ${loading ? 'loading' : ''}`}>
      {loading && <div className="loading-spinner">Loading...</div>}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onLoad={() => setLoading(false)}
        onError={() => {
          console.error('Image load failed:', src);
          setImgSrc('/placeholder-image.jpg');
          setLoading(false);
          setError(true);
        }}
      />
      {error && <div className="error-overlay">Failed to load image</div>}
    </div>
  );
};

export default ImageWithFallback;