import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const { FiEdit3, FiLogOut, FiHome, FiList, FiTag } = FiIcons;

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="w-[90%] mx-auto px-6 py-8">
          <nav className="flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-light tracking-wide text-gray-900 hover:text-gray-600 transition-colors"
            >
              minimal.blog
            </Link>

            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <SafeIcon icon={FiHome} className="w-4 h-4" />
                <span className="text-sm">Home</span>
              </Link>

              <Link
                to="/articles"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <SafeIcon icon={FiList} className="w-4 h-4" />
                <span className="text-sm">Articles</span>
              </Link>

              <Link
                to="/tags"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <SafeIcon icon={FiTag} className="w-4 h-4" />
                <span className="text-sm">Tags</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                    <span className="text-sm">Admin</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="w-[90%] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;