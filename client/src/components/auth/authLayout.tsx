import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl flex shadow-lg rounded-2xl overflow-hidden bg-white">
        {/* Cột bên trái: banner/illustration */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center p-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Chào mừng bạn đến với Shop
            </h1>
            <p className="text-lg text-indigo-100">
              Nơi mua sắm trực tuyến nhanh chóng & tiện lợi
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2 rounded-full bg-white text-indigo-600 font-medium hover:bg-indigo-50 transition"
            >
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* Cột bên phải: form login/register */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-6">
              {/* Logo */}
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                MyShop
              </Link>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
