import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faClipboardList,
  faFolderClosed,
  faStore,
  faGear,
  faCloudSun,
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './navbar.css';
export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
  }
  return (
    <>
      <div id="big-nav" className="nav">
        <img src="/logo.png" alt="logo" />
        <div className="links">
          <NavLink className={({ isActive }) => (isActive ? 'link a' : 'link')} to="/dashboard">
            <FontAwesomeIcon icon={faGauge} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'link a' : 'link')} to="/tasks">
            <FontAwesomeIcon icon={faClipboardList} />
            <span>Tasks</span>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'link a' : 'link')} to="/files">
            <FontAwesomeIcon icon={faFolderClosed} />
            <span>Files</span>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'link a' : 'link')} to="/catalog">
            <FontAwesomeIcon icon={faStore} />
            <span>Catalog</span>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'link a' : 'link')} to="/weather">
            <FontAwesomeIcon icon={faCloudSun} />
            <span>Weather</span>
          </NavLink>
          <NavLink
            id="set"
            className={({ isActive }) => (isActive ? 'set a' : 'set')}
            to="/settings"
          >
            <FontAwesomeIcon icon={faGear} />
            <span>Settings</span>
          </NavLink>
        </div>
        <button onClick={handleLogout}>Log out</button>
      </div>
      <div id="small-nav" className="nav">
        <div className="banner">
          <img src="/logo.png" alt="logo" />
          <button onClick={handleLogout}>Log out</button>
        </div>
        <div className="links">
          <NavLink className={({ isActive }) => (isActive ? 'link a' : 'link')} to="/dashboard">
            <FontAwesomeIcon icon={faGauge} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'link a' : 'link')} to="/tasks">
            <FontAwesomeIcon icon={faClipboardList} />
            <span>Tasks</span>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'link a' : 'link')} to="/files">
            <FontAwesomeIcon icon={faFolderClosed} />
            <span>Files</span>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'link a' : 'link')} to="/catalog">
            <FontAwesomeIcon icon={faStore} />
            <span>Catalog</span>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'link a' : 'link')} to="/weather">
            <FontAwesomeIcon icon={faCloudSun} />
            <span>Weather</span>
          </NavLink>
          <NavLink
            id="set"
            className={({ isActive }) => (isActive ? 'set a' : 'set')}
            to="/settings"
          >
            <FontAwesomeIcon icon={faGear} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}