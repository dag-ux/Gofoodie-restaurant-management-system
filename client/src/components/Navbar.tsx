import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Utensils, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon, 
  Sun, 
  Moon,
  Home,
  BookOpen,
  Info,
  Phone,
  Calendar
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import logoLight from '../assets/logo-light.png';
import logoDark from '../assets/logo-dark.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Zustand stores
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  
  const navigate = useNavigate();

  const handleLogout = () => { 
    logout(); 
    setIsMenuOpen(false); 
    navigate('/'); 
  };

  return (
    <nav className="bg-white dark:bg-black shadow-sm sticky top-0 z-50 border-b border-stone-200 dark:border-stone-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-50" onClick={() => setIsMenuOpen(false)}>
            <div className="relative h-12 md:h-14 w-32 md:w-40">
              <img src={logoLight} alt="GoofFoodie" className="block dark:hidden h-full w-auto object-contain" />
              <img src={logoDark} alt="GoofFoodie" className="hidden dark:block h-full w-auto object-contain" />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 font-medium">
            <Link to="/" className="text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange transition-colors font-bold">Home</Link>
            <Link to="/menu" className="text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange transition-colors font-bold">Menu</Link>
            <Link to="/about" className="text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange transition-colors font-bold">About</Link>
            <Link to="/contact" className="text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange transition-colors font-bold">Contact</Link>
            <Link to="/reserve" className="text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange transition-colors font-bold">Reserve</Link>
          </div>

          {/* Right Side Icons (Desktop & Mobile) */}
          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={toggleTheme} className="p-2 text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange transition-colors">
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            <Link to="/cart" className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange transition-colors">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-gofoodie-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Desktop User/Login */}
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                {/* 👇 Profile Link 👇 */}
                <Link to="/profile" className="text-stone-600 dark:text-stone-300 font-bold text-sm flex items-center gap-2 hover:text-gofoodie-orange transition-colors">
                  <UserIcon size={16} /> {user.name}
                </Link>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-500 p-2 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-gofoodie-orange text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 hidden md:flex items-center gap-2 transition-colors">
                <Utensils size={18} /> Login
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2 text-stone-600 dark:text-stone-300 z-50 hover:text-gofoodie-orange transition-colors"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Premium Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 shadow-2xl transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="flex flex-col px-4 pt-3 pb-6 space-y-1.5">
          
          {/* Links with Icons */}
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-gofoodie-orange transition-all">
            <Home size={18} /> Home
          </Link>
          <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-gofoodie-orange transition-all">
            <BookOpen size={18} /> Menu
          </Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-gofoodie-orange transition-all">
            <Info size={18} /> About Us
          </Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-gofoodie-orange transition-all">
            <Phone size={18} /> Contact
          </Link>
          <Link to="/reserve" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3.5 rounded-xl text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-gofoodie-orange transition-all">
            <Calendar size={18} /> Reserve Table
          </Link>

          {/* Auth Section */}
          <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800">
            {user ? (
              <div className="space-y-2">
                {/* 👇 Mobile Profile Link 👇 */}
                <Link 
                  to="/profile" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3.5 bg-stone-50 dark:bg-stone-900 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <div className="bg-gofoodie-orange/10 p-2 rounded-full">
                    <UserIcon size={18} className="text-gofoodie-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-stone-500">View Profile & Orders</p>
                  </div>
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl text-red-500 font-bold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-3.5 rounded-xl font-bold shadow-md hover:opacity-90 transition-all">
                <Utensils size={18} /> Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;