import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';

// Admin Imports
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import OrdersPage from './pages/admin/OrdersPage';
import AdminMenuPage from './pages/admin/AdminMenuPage'; // Import the new Menu Management page

import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

// Layout for all public-facing pages (includes Navbar and Footer)
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const isDark = useThemeStore((state) => state.isDark);
  const { user } = useAuthStore();

  // Apply dark mode class to the HTML element
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <Router>
      <div className="font-sans text-stone-800 dark:text-stone-100">
        <Routes>
          
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/staff-login" element={<AdminLoginPage />} />
          </Route>

          {/* Hidden Admin Routes (Protected) */}
          <Route 
            path="/admin" 
            element={user?.role === 'ADMIN' ? <AdminLayout /> : <Navigate to="/staff-login" />}
          >
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
          </Route>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;