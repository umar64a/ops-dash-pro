import { db } from './db';
import { apiClient } from './apiClient';
import type { Product } from '../types/product';
const CACHE_KEY = 'catalog-products';
const CACHE_TTL = 5 * 60 * 1000;
export const fetchCatalogProducts = async (): Promise<{
  data: Product[];
  isOfflineData: boolean;
}> => {
  const cached = await db.catalogCache.get(CACHE_KEY);
  if (!navigator.onLine && cached) {
    return { data: cached.data, isOfflineData: true };
  }
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    return { data: cached.data, isOfflineData: false };
  }
  try {
    const data = await apiClient<Product[]>('https://fakestoreapi.com/products');
    await db.catalogCache.put({
      id: CACHE_KEY,
      data,
      cachedAt: Date.now(),
    });
    return { data, isOfflineData: false };
  } catch (error) {
    if (cached) {
      return { data: cached.data, isOfflineData: true };
    }
    throw new Error('No internet connection & no offline data.');
  }
};