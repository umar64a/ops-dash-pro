import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../types/product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { db } from '../services/db';
import { apiClient } from '../services/apiClient';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import './productDetails.css';
export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { isOnline, showOnlineMsg } = useOnlineStatus();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      const cacheKey = `product-${id}`;
      const cached = await db.catalogCache.get(cacheKey);
      try {
        if (isOnline) {
          const data: Product = await apiClient<Product>(`https://fakestoreapi.com/products/${id}`);
          setProduct(data);
          setIsOfflineData(false);
          await db.catalogCache.put({
            id: cacheKey,
            data: [data],
            cachedAt: Date.now(),
          });
        } else if (cached) {
          setProduct(cached.data[0]);
          setIsOfflineData(true);
        } else {
          setProduct(null);
          setError('No internet connection & no offline data');
        }
      } catch (err) {
        if (cached) {
          setProduct(cached.data[0]);
          setIsOfflineData(true);
        } else {
          setProduct(null);
          setError('Failed to fetch product');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isOnline]);
  return (
    <div className="pro-body">
      {!isOnline && (
        <div className="net-status">
          <span className="offline">Offline</span>
        </div>
      )}
      {showOnlineMsg && (
        <div className="net-status">
          <span className="online">Back Online</span>
        </div>
      )}
      <h1>Product Details</h1>
      {isOfflineData && (
        <div className="badge">
          <span>Offline Data</span>
        </div>
      )}
      {loading && (
        <div className="pro-load">
          <span>Loading...</span>
        </div>
      )}
      {!error && !product && (
        <div className="pro-error">
          <span>{error}</span>
        </div>
      )}
      {!error && !loading && !product && <div className="not-pro">Product not found!</div>}
      {product && (
        <div className="pro-details">
          <div className="pro-img">
            <img src={product.image} alt="Product image" />
          </div>
          <div className="pro-text">
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <span className="price">${product.price}</span>
            <span className="rating">
              <FontAwesomeIcon icon={faStar} />
              {product.rating.rate} reviews:({product.rating.count})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
