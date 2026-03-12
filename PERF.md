# Performance Optimization

## 1. Memoization

The application uses multiple memoization strategies to reduce unnecessary computations and prevent excessive component re-renders.

### React Memoization

React memoization is implemented using the `useMemo()` hook.

Examples include:

* Task filtering and sorting
* Weather visual calculations
* Temperature formatting
* Catalog product filtering and sorting

This ensures that expensive calculations are only recomputed when their dependencies change.

### Redux Memoized Selectors

Dashboard statistics are computed using memoized selectors created with **createSelector**.

Memoized selectors are used for:

* Task statistics
* File statistics
* Catalog statistics

These selectors ensure that dashboard metrics are only recalculated when the relevant Redux state changes, which improves rendering performance and prevents unnecessary recomputation.

---

## 2. Debounced Search

Product catalog search uses debouncing to avoid excessive filtering operations.

Benefits:

* fewer renders
* improved user experience

---

## 3. Sorting Algorithm Comparison

Two sorting algorithms are implemented:

* Merge Sort
* Quick Sort

Sorting performance is measured using:

performance.now()

This allows comparison of algorithm efficiency.

---

## 4. IndexedDB Storage

Using IndexedDB reduces API calls and improves application responsiveness.

Benefits:

* faster data access
* offline support
* reduced network usage

---

## 5. Background Sync Processing

The synchronization engine processes queued operations in the background.

This prevents UI blocking and improves overall responsiveness.