import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Files from './pages/Files';
import Settings from './pages/Settings';
import Catalog from './pages/Catalog';
import NotFound from './pages/NotFound';
import Weather from './pages/Weather';
import ProductDetails from './pages/ProductDetails';
import Layout from './commponents/Layout';
import ConflictModal from './commponents/ConflictModal';
import { useAppSelector } from './hooks/reduxHooks';
import { useEffect } from 'react';
import { useSync } from './hooks/useSync';
import { useFileSync } from './hooks/useFileSync';
import { initializeServerData } from './services/syncEngine';
function App() {
  useSync();
  useFileSync();
  useEffect(() => {
    initializeServerData();
  }, []);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/files" element={<Files />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ProductDetails />} />
          <Route path="/weather" element={<Weather />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ConflictModal />
    </>
  );
}
export default App;