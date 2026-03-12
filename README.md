# OpsDash Pro App

## Overview

OpsDash Pro is a modern **Operations Dashboard Progressive Web App (PWA)** built with **React, Redux Toolkit, TypeScript and Vite**.
The application integrates multiple modules such as task management, file management, product catalog, and weather services into a single dashboard.

The system is designed with an **offline-first architecture** using **IndexedDB (Dexie)** and a **synchronization queue** to keep data consistent when the network becomes available.

---

# Features

## 1. Authentication

* Simple login system
* Token stored in localStorage
* Protected dashboard routes

---

## 2. Operations Dashboard

The dashboard provides real-time system statistics including:

* Task statistics
* File upload statistics
* Catalog product statistics
* Weather widget
* Network status

---

## 3. Task Management System

The task module provides advanced task management functionality.

### Task Features

* Create tasks
* Edit tasks
* Delete tasks
* Bulk delete tasks
* Mark done tasks
* Priority levels (low, medium, high)
* Task status (todo, in-progress, done)
* Due dates
* Tags
* Attachments

### Algorithms

Two sorting algorithms are implemented:

* Merge Sort
* Quick Sort

The system measures sorting performance using `performance.now()`.

---

## 4. File Management

Users can manage files within the system.

### File Features

* Upload files
* File metadata display
* File preview
* Delete files
* File type icons
* File size formatting

Files are stored locally in **IndexedDB** and queued for server upload.

---

## 5. Product Catalog

The catalog module displays products fetched from an external API.

### Catalog Features

* Product list
* Product detail page
* Category filtering
* Search with debounce
* Sorting algorithms (Merge / Quick)
* Save favorite products to localStorage

---

## 6. Weather Module

The weather module displays real-time weather information.

### Weather Features

* Geolocation detection
* Reverse geocoding
* Weather API integration
* Temperature conversion
* Dynamic weather background videos
* Cached weather data for offline mode

---

## 7. Offline-First Architecture

The system supports offline usage through:

* IndexedDB storage
* Dexie database
* Offline data caching
* Automatic synchronization queue

Users can continue working even without internet connectivity.

---

## 8. Synchronization Engine

A background synchronization system processes queued operations.

Sync operations include:

* Task creation
* Task updates
* File uploads

Queued operations are processed automatically when the network reconnects.

---

## Performance Optimization

Several techniques are used to optimize application performance.

### Memoization

The application uses **React useMemo** to avoid unnecessary recalculations for expensive operations such as:

* task filtering
* catalog sorting
* weather visual computation

### Memoized Redux Selectors

Dashboard statistics are optimized using **createSelector** from Redux Toolkit.

This memoization ensures that computed values such as:

* total tasks
* pending uploads
* saved catalog items

are only recalculated when the relevant state data changes.

### Algorithm Performance Measurement

Sorting operations use **performance.now()** to measure the execution time of Merge Sort and Quick Sort, allowing comparison of algorithm performance.

---

## 9. Network Status Detection

The application detects network connectivity changes.

Features include:

* Offline indicator
* Online reconnect message
* Offline cached data usage

---

## 10. Progressive Web App (PWA)

The system supports PWA capabilities.

Features include:

* Service Worker caching
* Offline support
* Installable web application
* Runtime caching using Workbox

---

## Security Notes

The application includes several security considerations:

- API requests use structured error handling.
- Request timeouts prevent hanging network calls.
- Local storage tokens are used only for session simulation.
- Inputs are validated before storing tasks and files.
- Network requests are handled through a centralized API client.

---

# Tech Stack

Frontend

* React
* TypeScript
* Vite

State Management

* Redux Toolkit

Offline Storage

* IndexedDB
* Dexie

Routing

* React Router

PWA

* Workbox
* Vite PWA Plugin

---

# Project Structure

src/
├── components/
├── pages/
├── store/
├── services/
├── hooks/
├── utils/
├── algorithms/
├── types/

---

# Installation

Clone repository:

git clone https://github.com/umar64a/ops-dash-pro.git

Install dependencies:

npm install

Run development server:

npm run dev

Build production:

npm run build

Preview build:

npm run preview

---

# Conclusion

OpsDash Pro demonstrates a modern web architecture combining **offline-first design, background synchronization, algorithm implementation, memoized state selectors, and modular Redux state management**.

The project highlights how complex operational dashboards can be built using modern frontend technologies while maintaining performance, scalability, and offline capabilities.