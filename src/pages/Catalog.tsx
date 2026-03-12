import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { mergeSortGeneric } from '../algorithms/mergeSort';
import { quickSortGeneric } from '../algorithms/quickSort';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useScrollFade } from '../hooks/useScrollFade';
import {
  fetchProducts,
  selectCatalog,
  setSearch,
  setCategory,
  setSortAlgorithm,
  setSortTime,
} from '../store/catalogSlice';
import {
  faHeart as faHeartSolid,
  faStar,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import './catalog.css';
export default function Catalog() {
  const { shouldFade, onMouseEnter, onMouseLeave } = useScrollFade(150, 1000);
  const [savedItems, setSavedItems] = useState<number[]>(() => {
    const saved = localStorage.getItem('savedCatalogItems');
    return saved ? (JSON.parse(saved) as number[]) : [];
  });
  const { isOnline, showOnlineMsg } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    products,
    status,
    error,
    search,
    filterCategory,
    sortAlgorithm,
    sortTime,
    isOfflineData,
  } = useAppSelector(selectCatalog);
  const [localSearch, setLocalSearch] = useState(search);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, isOnline]);
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearch(localSearch));
    }, 400);
    return () => clearTimeout(handler);
  }, [localSearch, dispatch]);
  const { sortedProducts, sortDuration } = useMemo(() => {
    let filtered = products;
    if (filterCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === filterCategory);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(s));
    }
    const start = performance.now();
    const sorted =
      sortAlgorithm === 'merge'
        ? mergeSortGeneric(filtered, (a, b) => a.price - b.price)
        : quickSortGeneric(filtered, (a, b) => a.price - b.price);
    const end = performance.now();
    return { sortedProducts: sorted, sortDuration: end - start };
  }, [products, filterCategory, search, sortAlgorithm]);
  useEffect(() => {
    dispatch(setSortTime(sortDuration));
  }, [sortDuration, dispatch]);
  const toggleSave = (id: number) => {
    const newSaved = savedItems.includes(id)
      ? savedItems.filter((x) => x !== id)
      : [...savedItems, id];
    setSavedItems(newSaved);
    localStorage.setItem('savedCatalogItems', JSON.stringify(newSaved));
  };
  return (
    <div className="catalog-body">
      {!isOnline && (
        <div className="net-status">
          <span className="offline">Offline</span>
        </div>
      )}
      {showOnlineMsg && (
        <div className="net-status">
          <span className="online">Back Online</span>
        </div>
      )}
      <h1>E-commerce style list</h1>
      <div
        className={`catalog-bar ${shouldFade ? 'scrolled' : ''}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="s-bar">
          <FontAwesomeIcon className="s-i" icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Search..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <select value={filterCategory} onChange={(e) => dispatch(setCategory(e.target.value))}>
          <option value="all">All</option>
          <option value="men's clothing">Men's</option>
          <option value="women's clothing">Women's</option>
          <option value="jewelery">Jewelery</option>
          <option value="electronics">Electronics</option>
        </select>
        <select
          value={sortAlgorithm}
          id="algo-sel"
          onChange={(e) => dispatch(setSortAlgorithm(e.target.value as 'merge' | 'quick'))}
        >
          <option value="merge">MergeSort</option>
          <option value="quick">QuickSort</option>
        </select>
        <span>Sorting Time: {sortTime.toFixed(2)} ms</span>
      </div>
      {isOfflineData && (
        <div className="badge">
          <span>Offline Data</span>
        </div>
      )}
      {sortedProducts.length === 0 && status !== 'loading' && !error && (
        <div className="not-res">
          <span>Result not found!</span>
        </div>
      )}
      {status === 'loading' && products.length === 0 && (
        <div className="catalog-load">
          <span>Loading...</span>
        </div>
      )}
      {error && products.length === 0 && (
        <div className="err-msg">
          <span>{error}</span>
        </div>
      )}
      <div className="catalog-list">
        {sortedProducts.map((p) => (
          <div className="product" key={p.id}>
            <div className="img-con" onClick={() => navigate(`/catalog/${p.id}`)}>
              <img src={p.image} alt="Product image" />
            </div>
            <div className="text-con">
              <h3>{p.title.slice(0, 15) + '...'}</h3>
              <span className="price">${p.price}</span>
              <span className="rating">
                <FontAwesomeIcon icon={faStar} />
                {p.rating.rate} reviews:({p.rating.count})
              </span>
              <button onClick={() => toggleSave(p.id)}>
                {savedItems.includes(p.id) ? (
                  <FontAwesomeIcon icon={faHeartSolid} />
                ) : (
                  <FontAwesomeIcon icon={faHeartRegular} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
