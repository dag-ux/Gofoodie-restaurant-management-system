import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Utensils, Menu, X, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import logoLight from '../assets/logo-light.png';
import logoDark from '../assets/logo-dark.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          
          {/* 👇 FIXED LOGO: Renders both, uses CSS to show the correct one 👇 */}
          <Link to="/" className="flex items-center gap-2 z-50">
            <div className="relative h-12 md:h-14 w-32 md:w-40">
              <img 
                src={logoLight} 
                alt="GoofFoodie" 
                className="block dark:hidden h-full w-auto object-contain" 
              />
              <img 
                src={logoDark} 
                alt="GoofFoodie" 
                className="hidden dark:block h-full w-auto object-contain" 
              />
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

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={toggleTheme} className="p-2 text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange">
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <Link to="/cart" className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange">
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-gofoodie-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Desktop User/Login */}
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-stone-600 dark:text-stone-300 font-bold text-sm flex items-center gap-2">
                  <UserIcon size={16} /> {user.name}
                </span>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-500 p-2">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-gofoodie-orange text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 hidden md:flex items-center gap-2">
                <Utensils size={18} /> Login
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2 text-stone-600 dark:text-stone-300 z-50"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-white dark:bg-black border-b border-stone-200 dark:border-stone-800 shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="flex flex-col px-4 pt-4 pb-6 space-y-4 font-medium text-base">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange py-2 border-b border-stone-100 dark:border-stone-800">Home</Link>
          <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange py-2 border-b border-stone-100 dark:border-stone-800">Menu</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange py-2 border-b border-stone-100 dark:border-stone-800">About</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange py-2 border-b border-stone-100 dark:border-stone-800">Contact</Link>
          <Link to="/reserve" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-stone-300 hover:text-gofoodie-orange py-2 border-b border-stone-100 dark:border-stone-800">Reserve</Link>

          {user ? (
            <>
              <span className="text-stone-600 dark:text-stone-300 py-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                <UserIcon size={18} /> Logged in as {user.name}
              </span>
              <button 
                onClick={handleLogout} 
                className="text-left text-red-400 py-2 border-b border-stone-100 dark:border-stone-800 font-bold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsMenuOpen(false)} 
              className="text-gofoodie-orange py-2 font-bold"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;