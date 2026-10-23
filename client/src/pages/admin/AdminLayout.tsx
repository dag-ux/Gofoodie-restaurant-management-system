import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Utensils, LogOut, Menu, X, ExternalLink, User, Sun, Moon, Mail, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-3.5 rounded-xl font-bold transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white shadow-[0_5px_15px_rgba(255,102,0,0.3)] transform scale-[1.02]'
        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-gofoodie-orange'
    }`;

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black transition-colors duration-300 overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full w-72 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-r border-stone-200 dark:border-stone-800 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header: Admin Dashboard with Gradient */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-stone-200 dark:border-stone-800">
          <h2 className="text-xl font-black tracking-tight bg-gradient-to-r from-gofoodie-orange via-gofoodie-yellow to-gofoodie-orange bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-stone-500 hover:bg-stone-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
          <NavLink to="/admin" end className={navLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          
          <NavLink to="/admin/orders" className={navLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
            <ShoppingCart size={20} /> Live Orders
          </NavLink>
          
          <NavLink to="/admin/menu" className={navLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
            <Utensils size={20} /> Manage Menu
          </NavLink>
        </nav>
        
        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800">
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-2 p-3 w-full rounded-xl text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 font-bold transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="relative h-20 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-4 sm:px-8 z-30">
          
          {/* LEFT: Mobile Menu Trigger only */}
          <div className="flex items-center gap-4 z-10 w-1/3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* CENTER: GooFoodie Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <Link to="/" className="text-3xl font-black tracking-tighter hover:opacity-80 transition-opacity">
              <span className="text-gofoodie-orange">GOF</span>
              <span className="text-gofoodie-yellow">OO</span>
              <span className="text-gofoodie-orange">DIE</span>
            </Link>
          </div>

          {/* RIGHT: Theme, View Site, Profile */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 z-10 w-1/3">
            
            {/* View Live Site */}
            <Link 
              to="/" 
              target="_blank"
              className="hidden lg:flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-gofoodie-orange transition-colors mr-2"
            >
              <ExternalLink size={16} /> Live Site
            </Link>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="h-6 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block"></div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-gofoodie-orange to-gofoodie-yellow rounded-full text-white shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                <User size={20} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden animate-slide-in z-50">
                  {/* Header */}
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-stone-800 dark:to-stone-800/50 border-b border-stone-100 dark:border-stone-800 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-stone-700 rounded-full flex items-center justify-center shadow-sm">
                      <User className="text-gofoodie-orange" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 dark:text-white text-sm">{user?.name || 'Admin User'}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{user?.email || 'admin@gofoodie.com'}</p>
                    </div>
                  </div>

                  {/* Info List */}
                  <div className="p-2">
                    <div className="flex items-center gap-3 px-4 py-3 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl cursor-default">
                      <Mail size={16} className="text-stone-400" />
                      <span className="truncate">{user?.email || 'admin@gofoodie.com'}</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl cursor-default">
                      <ShieldAlert size={16} className="text-gofoodie-orange" />
                      <span className="font-bold uppercase tracking-wider text-xs">{user?.role || 'ADMIN'} ACCESS</span>
                    </div>
                  </div>

                  {/* Logout Action */}
                  <div className="p-2 border-t border-stone-100 dark:border-stone-800">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* MAIN SCROLLABLE AREA */}
        <main className="flex-1 overflow-y-auto relative p-4 sm:p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gofoodie-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gofoodie-orange/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;