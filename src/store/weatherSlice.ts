import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { WeatherItem, WeatherState } from '../types/weather';
import { fetchWeather } from '../services/weatherService';
const initialState: WeatherState = {
  data: null,
  loading: true,
  error: null,
};
export const loadWeather = createAsyncThunk<
  WeatherItem,
  { lat: number; lon: number; city: string; countryCode: string }
>('weather/load', async (payload, { rejectWithValue }) => {
  try {
    return await fetchWeather(payload.lat, payload.lon, payload.city, payload.countryCode);
  } catch (err) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Failed to load weather.');
  }
});
const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(loadWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = null;
      });
  },
});
export default weatherSlice.reducer;