import { Link, useLocation } from 'react-router-dom';
import './breadCrumbs.css';
const routeNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  tasks: 'Tasks',
  files: 'Files',
  settings: 'Settings',
  catalog: 'Catalog',
  weather: 'Weather',
};
export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);
  if (pathnames.length === 1 && pathnames[0] === 'dashboard') return;
  return (
    <div className="bread">
      <Link className="crumbs" to="/dashboard">
        Dashboard
      </Link>
      {pathnames.map((value, index) => {
        const to = '/' + pathnames.slice(0, index + 1).join('/');
        const isLast = index === pathnames.length - 1;
        let name = routeNameMap[value];
        if (!name) {
          if (!isNaN(Number(value))) {
            name = 'Product Details';
          } else {
            name = value.charAt(0).toUpperCase() + value.slice(1);
          }
        }
        return (
          <span key={to}>
            <span className="crumbs"> / </span>
            {isLast ? (
              <span className="crumbs">{name}</span>
            ) : (
              <Link className="crumbs" to={to}>
                {name}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}