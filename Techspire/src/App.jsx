import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context & Guards
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
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import CategoryList from "./pages/admin/CategoryList";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Layout wrapper for Navbar */}
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
            <Route
              path="admin/categories"
              element={
                <AdminRoute>
                  <CategoryList />
                </AdminRoute>
              }
            />

            {/* --- 404 CATCH-ALL --- */}
            <Route path="*" element={<NotFound />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  </UserProvider>
  );
}

export default App;