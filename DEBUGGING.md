# Debugging Notes

## 1. Weather API Failures

Problem:
Weather API occasionally failed due to network timeouts.

Solution:
A custom API client with retry logic and request timeout was implemented.

Key fixes:

* AbortController used for timeout
* Automatic retry with exponential backoff

---

## 2. Offline Data Handling

Problem:
Data was lost when the application went offline.

Solution:
Implemented IndexedDB storage using Dexie to store:

* tasks
* files
* sync queue
* cached weather data

This allows the application to continue working offline.

---

## 3. Sync Queue Conflicts

Problem:
When multiple updates occurred offline, operations could be duplicated.

Solution:
A synchronization queue system was implemented where each operation includes:

* unique ID
* retry counter
* timestamp

Duplicate operations are filtered before processing.

---

## 4. File Upload Queue

Problem:
Files uploaded offline were not sent to the server after reconnecting.

Solution:
File uploads are stored in a queue and processed by the sync engine when internet connectivity returns.

---

## 5. Reverse Geocoding Errors

Problem:
Location API sometimes returned unexpected city names.

Solution:
City values are sanitized and fallback values are used when data is missing.

---

## 6. React Performance Issues

Problem:
Frequent component re-renders caused unnecessary calculations in some components such as weather visuals and catalog filtering.

Solution:
Memoization techniques were implemented to reduce repeated computations.

Fixes implemented:

* React `useMemo()` for expensive calculations
* Memoized Redux selectors using `createSelector`
* Debounced search for catalog filtering

These optimizations ensured that components only recompute values when their dependencies actually change.

---

## 7. Sorting Algorithm Verification

Problem:
Sorting behavior needed verification to ensure that both Merge Sort and Quick Sort produced correct results.

Solution:
Sorting execution time was measured using `performance.now()` and results were visually compared in the UI.

This helped confirm that:

* both algorithms produced correct sorted outputs
* sorting performance differences could be observed

---

## 8. Network State Handling

Problem:
The application needed to properly handle switching between online and offline states.

Solution:
A custom hook `useOnlineStatus` was implemented to listen to browser `online` and `offline` events.

This allowed the application to:

* display an offline indicator
* show a reconnect message when the network returns
* trigger background synchronization when connectivity is restored