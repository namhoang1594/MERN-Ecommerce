import { Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthRegister from "./pages/auth/register";
import AuthLogin from "./pages/auth/login";
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
// import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingAllProducts from "./pages/shopping-view/all-Products";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
// import SearchProducts from "./pages/shopping-view/search";
import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";
import CheckAuth from "./components/common/check-auth";
import PrivateRoute from "./components/common/private-route";
import AdminRoute from "./components/common/admin-route";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth, setUser } from "./store/auth-slice";
import { AppDispatch, RootState } from "./store/store";
import { Skeleton } from "./components/ui/skeleton";

const App = () => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="h-[600px] w-[800px] bg-black" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Public user routes (no prefix like /shop) */}
        <Route path="/" element={<ShoppingLayout />}>
          <Route index element={<ShoppingHome />} />
          <Route path="products" element={<ShoppingAllProducts />} />
          {/* <Route path="listing" element={<ShoppingListing />} />
          <Route path="search" element={<SearchProducts />} /> */}

          <Route
            path="checkout"
            element={
              <PrivateRoute>
                <ShoppingCheckout />
              </PrivateRoute>
            }
          />
          <Route
            path="account"
            element={
              <PrivateRoute>
                <ShoppingAccount />
              </PrivateRoute>
            }
          />
          <Route
            path="paypal-return"
            element={
              <PrivateRoute>
                <PaypalReturnPage />
              </PrivateRoute>
            }
          />
          <Route
            path="payment-success"
            element={
              <PrivateRoute>
                <PaymentSuccessPage />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Auth routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route
            path="dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="categories"
            element={
              <AdminRoute>
                <AdminCategory />
              </AdminRoute>
            }
          />
          <Route
            path="brands"
            element={
              <AdminRoute>
                <AdminBrand />
              </AdminRoute>
            }
          />
          <Route
            path="banner"
            element={
              <AdminRoute>
                <BannerManager />
              </AdminRoute>
            }
          />
          <Route
            path="site-setting"
            element={
              <AdminRoute>
                <SiteSetting />
              </AdminRoute>
            }
          />
        </Route>

        {/* Other routes */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
