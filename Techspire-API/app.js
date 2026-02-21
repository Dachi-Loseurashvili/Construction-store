require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const productRoutes = require('./routes/products').default;
const orderRoutes = require('./routes/orders').default;
const uploadRoutes = require('./routes/uploads').default;
const categoryRoutes = require('./routes/categories').default;
const { getBrands } = require('./controllers/ProductController.js');

const app = express();

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// CORS: strict allowlist for cookie-based auth safety
// - If FRONTEND_URL is set, allow only that origin with credentials
// CORS: strict allowlist for cookie-based auth safety
// changed mnaually
const allowedOrigin =
  process.env.FRONTEND_URL ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:5173" : null);

if (allowedOrigin) {
  app.use(
    cors({
      origin: allowedOrigin,
      credentials: true,
    })
  );
}
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route Mounting
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.get('/api/brands', getBrands);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.status || 500);
  res.status(statusCode).json({
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;