// src/Layout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import AxiosApi from '../AxiosAPI';

const Layout = () => {

  const logout = async () => {
    try {
      await AxiosApi.get('/logout');
      window.location.href = '/';
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="bg-sky-700 h-14 flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src="/9.png" alt="ShopSmart Logo" className="rounded-full h-12 w-12 mr-3" />
          <Link to="/" className="text-slate-50 text-2xl font-serif">ShopSmart</Link>
        </div>
        <div className="hidden sm:flex items-center">
          <h4 className="text-xl text-zinc-50 font-serif">Admin Dashboard</h4>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar for Medium and Larger Screens */}
        <nav className="bg-slate-800 w-64 hidden md:block">
          <div className="p-4">
            <p className="text-2xl text-slate-50 font-serif mb-4">Admin Access</p>
            <ul className="space-y-2">
              <li className="flex items-center space-x-3 border-b-2">
                <i className="fa-solid fa-house text-gray-100 text-2xl"></i>
                <Link
                  to="dashboard"
                  className="text-white text-xl hover:text-cyan-500 hover:underline  "
                >
                  Dashboard
                </Link>
              </li>
              <li className="flex items-center space-x-3 border-b-2">
                <i className="fa-solid fa-users-gear text-gray-100 text-2xl"></i>
                <Link
                  to="users"
                  className="text-white text-xl hover:text-cyan-500 hover:underline"
                >
                  Users
                </Link>
              </li>
              <li className="flex items-center space-x-3 border-b-2">
                <i className="fa-brands fa-product-hunt text-gray-100 text-2xl"></i>
                <Link
                  to="add-product"
                  className="text-white text-xl hover:text-cyan-500 hover:underline"
                >
                  Add Product
                </Link>
              </li>
              <li className="flex items-center space-x-3 border-b-2">
                <i className="fa-solid fa-box-open text-gray-100 text-2xl"></i>
                <Link
                  to="view-products"
                  className="text-white text-xl hover:text-cyan-500 hover:underline"
                >
                  View Products
                </Link>
              </li>
              <li className="flex items-center space-x-3 border-b-2">
                <i className="fa-solid fa-truck text-gray-100 text-2xl"></i>
                <Link
                  to="orders"
                  className="text-white text-xl hover:text-cyan-500 hover:underline"
                >
                  Orders
                </Link>
              </li>
              <li className="flex items-center space-x-3 border-b-2">
                <i className="fa-solid fa-ticket text-gray-100 text-2xl"></i>
                <Link
                  to="view-coupon"
                  className="text-white text-xl hover:text-cyan-500 hover:underline"
                >
                  Coupons
                </Link>
              </li>
              <li className="flex items-center space-x-3 border-b-2">
                <i className="fa-solid fa-right-from-bracket text-gray-100 text-2xl"></i>
                <button onClick={logout}
                
                  className="text-white text-xl hover:text-cyan-500 hover:underline"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation for Small Screens */}
      <footer className="bg-slate-800 md:hidden">
        <nav className="flex justify-around p-2">
          <Link
            to="dashboard"
            className="flex flex-col items-center text-white hover:text-cyan-500"
          >
            <i className="fa-solid fa-house text-2xl"></i>
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link
            to="users"
            className="flex flex-col items-center text-white hover:text-cyan-500"
          >
            <i className="fa-solid fa-users-gear text-2xl"></i>
            <span className="text-sm">Users</span>
          </Link>
          <Link
            to="add-product"
            className="flex flex-col items-center text-white hover:text-cyan-500"
          >
            <i className="fa-brands fa-product-hunt text-2xl"></i>
            <span className="text-sm">Add Product</span>
          </Link>
          <Link
            to="view-products"
            className="flex flex-col items-center text-white hover:text-cyan-500"
          >
            <i className="fa-solid fa-box-open text-2xl"></i>
            <span className="text-sm">Products</span>
          </Link>
          <button
            onClick={logout}
            className="flex flex-col items-center text-white hover:text-cyan-500"
          >
            <i className="fa-solid fa-right-from-bracket text-2xl"></i>
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
