import { Link } from 'react-router-dom';
import "./notfound.css"
export default function NotFound() {
  return (
    <div className="div">
    <div className='not'>
      <span className='spn'>404</span>
      <span className='span'>Page not found!</span>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
    </div>
  );
}