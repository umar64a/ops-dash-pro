import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { CatalogState, Product } from '../types/product';
import { fetchCatalogProducts } from '../services/catalogService';
const initialState: CatalogState = {
  products: [],
  status: 'idle',
  error: null,
  search: '',
  filterCategory: 'all',
  sortAlgorithm: 'merge',
  sortTime: 0,
  isOfflineData: false,
};
export const fetchProducts = createAsyncThunk<
  { data: Product[]; isOfflineData: boolean },
  void,
  { rejectValue: string }
>('catalog/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchCatalogProducts();
    return data;
  } catch (error) {
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue('Failed to fetch products.');
  }
});
const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.filterCategory = action.payload;
    },
    setSortAlgorithm(state, action: PayloadAction<'merge' | 'quick'>) {
      state.sortAlgorithm = action.payload;
    },
    setSortTime(state, action: PayloadAction<number>) {
      state.sortTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.data;
        state.isOfflineData = action.payload.isOfflineData;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch products.';
        state.products = [];
      });
  },
});
export const { setSearch, setCategory, setSortAlgorithm, setSortTime } = catalogSlice.actions;
export const selectCatalog = (state: RootState) => state.catalog;
export default catalogSlice.reducer;