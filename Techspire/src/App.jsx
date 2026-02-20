import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context & Guards
import { CartProvider } from './contexts/CartProvider';
import { UserProvider } from './contexts/UserProvider';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Layout & Components
import Layout from "./components/Layout";

// Page Imports
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Gallery from "./pages/Gallery";
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Layout wrapper for Navbar and CartDrawer */}
            <Route path="/" element={<Layout />}>
              
              {/* --- PUBLIC ROUTES --- */}
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="support" element={<Support />} />
              <Route path="auth" element={<Auth />} />
              <Route path="product/:slug" element={<ProductDetail />} />

              {/* --- PROTECTED ROUTES (Login Required) --- */}
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              {/* --- ADMIN ROUTES --- */}
              <Route
                path="admin/products"
                element={
                  <AdminRoute>
                    <ProductList />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/products/new"
                element={
                  <AdminRoute>
                    <ProductForm />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/products/:id/edit"
                element={
                  <AdminRoute>
                    <ProductForm />
                  </AdminRoute>
                }
              />

              {/* --- 404 CATCH-ALL --- */}
              <Route path="*" element={<NotFound />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </UserProvider>
  );
}

export default App;