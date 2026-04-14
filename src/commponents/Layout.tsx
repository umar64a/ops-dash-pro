import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BreadCrumbs from './BreadCrumbs';
export default function Layout() {
  return (
    <>
      <Navbar />
      <div style={{ position: 'relative' }}>
        <BreadCrumbs />
        <Outlet />
      </div>
    </>
  );
}