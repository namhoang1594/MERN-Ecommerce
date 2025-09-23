import { Routes, Route } from "react-router-dom";

import AuthLayout from "./components/auth/authLayout";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/product/products";
import AdminCategory from "./pages/admin-view/category/category";
import AdminBrand from "./pages/admin-view/brand/brand";
import AdminUsers from "./pages/admin-view/user-management/userManagement";
import AdminOrdersPage from "./pages/admin-view/orders/order";

import BannerManager from "./pages/admin-view/site-setting/banner";
import SiteSetting from "./pages/admin-view/site-setting/site-setting";

import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./pages/shopping-view/home/home";
import ShoppingProductDetails from "./pages/shopping-view/productDetails/product-Details";
import ShoppingAllProducts from "./pages/shopping-view/all-Products";
import ProfilePage from "./pages/shopping-view/user-profile/user-profile";
import CartPage from "./pages/shopping-view/cart";
import PaypalSuccessPage from "./pages/shopping-view/orders/checkout/paypal-success";
import PaypalCancelPage from "./pages/shopping-view/orders/checkout/paypal-cancel";
import OrdersPage from "./pages/shopping-view/orders/orders";
import CheckoutPage from "./pages/shopping-view/orders/checkout/checkout";
import SearchPage from "./pages/shopping-view/search";

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

        <Route
          path="/profile/*"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route
          path="/checkout/paypal/success"
          element={<PaypalSuccessPage />}
        />
        <Route path="/checkout/paypal/cancel" element={<PaypalCancelPage />} />
        <Route path="/search" element={<SearchPage />} />

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
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="categories" element={<AdminCategory />} />
          <Route path="brands" element={<AdminBrand />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="banner" element={<BannerManager />} />
          <Route path="site-setting" element={<SiteSetting />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
