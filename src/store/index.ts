import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './taskSlice';
import filesReducer from './fileSlice';
import weatherReducer from './weatherSlice';
import authReducer from './authSlice';
import catalogReducer from './catalogSlice';
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    files: filesReducer,
    weather: weatherReducer,
    auth: authReducer,
    catalog: catalogReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;