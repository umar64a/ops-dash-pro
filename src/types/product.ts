export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sortTime: number;
  rating: { rate: number; count: number };
}
export interface CatalogState {
  products: Product[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  search: string;
  filterCategory: string;
  sortTime: number;
  sortAlgorithm: 'merge' | 'quick';
  isOfflineData: boolean;
}