import { Routes, Route } from "react-router-dom";

import AuthLayout from "./components/auth/authLayout";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/product/products";
import AdminOrders from "./pages/admin-view/order";
import AdminCategory from "./pages/admin-view/category/category";
import AdminBrand from "./pages/admin-view/brand/brand";
import BannerManager from "./pages/admin-view/site-setting/banner";
import SiteSetting from "./pages/admin-view/site-setting/site-setting";

import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./pages/shopping-view/home/home";
import ShoppingProductDetails from "./pages/shopping-view/productDetails/product-Details";
import ShoppingAllProducts from "./pages/shopping-view/all-Products";
// import SearchProducts from "./pages/shopping-view/search";

import ProtectedRoute from "./components/auth/protectedGuard";
import RoleGuard from "./components/auth/roleGuard";

const App = () => {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Public user routes (no prefix like /shop) */}
        <Route path="/" element={<ShoppingLayout />}>
          <Route index element={<ShoppingHome />} />
          <Route path="products" element={<ShoppingAllProducts />} />
          <Route path="products/:slug" element={<ShoppingProductDetails />} />
        </Route>

        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["admin"]}>
                <AdminLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategory />} />
          <Route path="brands" element={<AdminBrand />} />
          <Route path="banner" element={<BannerManager />} />
          <Route path="site-setting" element={<SiteSetting />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
