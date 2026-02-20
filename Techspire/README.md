# Techspire 🚀

**Techspire** is a premium, minimalist web application built for the modern network engineer. It combines an immersive visual lookbook with a functional e-commerce interface, emphasizing high-performance hardware and "clean-room" aesthetics.



## 🛠️ Tech Stack

* **Core:** React 18 (Vite)
* **Routing:** React Router v6 (URL-driven state)
* **Styling:** Tailwind CSS (Mobile-first design)
* **Icons:** Lucide-React
* **Deployment:** Vercel / Netlify optimized

## ✨ Key Features

### 🖼️ Visual Laboratory (Gallery)
A masonry-style lookbook showcasing premium networking environments. This page uses a dynamic grid logic (`auto-rows`) to create a high-end editorial feel, perfect for demonstrating brand aesthetic without commercial friction.

### 🔍 Search & Filter Engine
* **Zero-State Sync:** The global search bar is bound directly to the URL parameters. This avoids redundant React state and ensures the UI stays synced even through browser history navigation.
* **Multi-Factor Filtering:** Users can filter hardware by category (Workstations, Accessories, etc.) or perform text-based searches simultaneously.

### 🖥️ Hardware Specification System
Detailed product views pull data from a centralized repository, rendering unique specs (CPU, RAM, Material, etc.) dynamically based on the hardware category.

### 📱 Responsive Engineering
A fully adaptive navigation system featuring a glassmorphism sticky header and a slide-down mobile menu designed for field engineers using tablets or phones.

## 📂 Project Structure

```text
src/
├── components/     # Navbar, Hero, and Layout wrappers
├── data/           # Centralized hardware data (products.js)
├── pages/          
│   ├── Shop.jsx        # Product listing & search logic
│   ├── Gallery.jsx     # Masonry lookbook
│   ├── ProductDetail.jsx # Dynamic spec rendering
│   └── NotFound.jsx    # Custom 404 "Connection Lost" page
└── App.jsx         # Routing configuration