import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer'; // Import the Cart Drawer

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import FoodDetailsPage from './pages/FoodDetailsPage';
import ReservationPage from './pages/ReservationPage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import OrdersPage from './pages/admin/OrdersPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminReservationsPage from './pages/admin/AdminReservationsPage';
import AdminTablesPage from './pages/admin/AdminTablesPage';


import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
    <Navbar />
    <CartDrawer />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const isDark = useThemeStore((state) => state.isDark);
  const { user } = useAuthStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
            <Route path="/food/:id" element={<FoodDetailsPage />} />
            <Route path="/reserve" element={<ReservationPage />} />
            <Route path="/profile" element={<ProfilePage />} />

          </Route>

          {/* Hidden Admin Routes (Protected) */}
          <Route 
            path="/admin" 
            element={user?.role === 'ADMIN' ? <AdminLayout /> : <Navigate to="/staff-login" />}
          >
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="reservations" element={<AdminReservationsPage />} />
            <Route path="tables" element={<AdminTablesPage />} />
          </Route>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;