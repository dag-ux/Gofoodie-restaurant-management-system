import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Utensils, Menu, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import logo from '../assets/logo2.png'; // 👈 USING YOUR NEW LOGO

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  return (
    <nav className="bg-stone-900 shadow-md sticky top-0 z-50 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. LOGO */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer z-50">
            <img 
              src={logo} 
              alt="GoofFoodie Logo" 
              className="h-12 md:h-14 w-auto object-contain" 
            />
          </Link>

          {/* 2. DESKTOP NAV LINKS */}
          <div className="hidden md:flex space-x-8 font-medium">
            <Link to="/" className="text-stone-300 hover:text-gofoodie-orange transition-colors">Home</Link>
            <a href="#menu" className="text-stone-300 hover:text-gofoodie-orange transition-colors">Menu</a>
            <a href="#" className="text-stone-300 hover:text-gofoodie-orange transition-colors">About</a>
            <a href="#" className="text-stone-300 hover:text-gofoodie-orange transition-colors">Contact</a>
          </div>

          {/* 3. RIGHT SIDE (CART & ORDER BUTTON) */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-stone-300 hover:text-gofoodie-orange transition-colors">
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-gofoodie-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Desktop Order Now Button */}
            <button className="bg-gofoodie-orange text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg hidden md:flex items-center gap-2">
              <Utensils size={18} /> Order Now
            </button>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-stone-300 hover:text-gofoodie-orange transition-colors z-50"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>
      </div>

      {/* 4. MOBILE MENU DROPDOWN */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-stone-900 border-b border-stone-800 shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="flex flex-col px-4 pt-2 pb-6 space-y-4 font-medium text-lg">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-stone-300 hover:text-gofoodie-orange py-2 border-b border-stone-800">Home</Link>
          <a href="#menu" onClick={() => setIsMenuOpen(false)} className="text-stone-300 hover:text-gofoodie-orange py-2 border-b border-stone-800">Menu</a>
          <a href="#" onClick={() => setIsMenuOpen(false)} className="text-stone-300 hover:text-gofoodie-orange py-2 border-b border-stone-800">About</a>
          <a href="#" onClick={() => setIsMenuOpen(false)} className="text-stone-300 hover:text-gofoodie-orange py-2 border-b border-stone-800">Contact</a>
          
          <button className="bg-gofoodie-orange text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-all shadow-md mt-4 flex items-center justify-center gap-2">
            <Utensils size={18} /> Order Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;