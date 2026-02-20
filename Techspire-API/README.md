# Techspire Backend Engine ⚡

The core API for **Techspire**, a premium hardware e-commerce platform. This project serves as a portfolio piece demonstrating full-stack proficiency, focusing on scalable architecture, secure authentication, and complex order lifecycle management.

---

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT)
* **Pattern:** Model-View-Controller (MVC)
* **Module System:** ES6 Modules (ESM)

---

## 🚀 Key Features

### 1. Secure Authentication Flow
* Implementation of `protect` and `admin` middlewares.
* Stateless authentication using JWT stored in local storage.
* Password encryption (Bcrypt) and secure user registration.

### 2. Order Lifecycle & Mock Payment
* **Verified Handshake:** Simulates a payment gateway response to bypass real Stripe/PayPal requirements while maintaining business logic.
* **Automated Fulfillment:** Orders are automatically marked as `Paid` upon successful mock authorization.

### 3. Dynamic Inventory Management
* **Atomic Updates:** Uses MongoDB `$inc` operators to simultaneously update `numSold` and decrement `countInStock` when an order is finalized.
* **Race Condition Protection:** Handles concurrent orders efficiently without data corruption.

### 4. Advanced Product Manifests
* Detailed schema supporting tech-specific metadata (specs, category, brand).
* Optimized queries for "Best Seller" filtering and search.

---

## 📦 Project Structure



```text
techspire_backend/
├── bin/            # Server entry point
├── controllers/    # Business logic (OrderController, ProductController)
├── middlewares/    # Auth guards and error handlers
├── models/         # Mongoose Schemas (User, Product, Order)
├── routes/         # Express API endpoints
├── .env            # Environment variables (Secrets)
└── app.js          # Express app configuration