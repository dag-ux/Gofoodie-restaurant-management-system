import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { Search, Loader2, Utensils } from 'lucide-react'; 
import { getMenuItems } from '../api/menuApi';
import type { MenuItem } from '../api/menuApi';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenuItems();
        setMenuItems(data);
        setFilteredItems(data);
        // Extract unique categories safely
        const uniqueCategories = ['All', ...new Set(data.map(item => (item.category as any)?.name || 'Other'))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Combined Filter Logic (Category + Search)
  useEffect(() => {
    let result = menuItems;
    
    if (activeCategory !== 'All') {
      result = result.filter(item => (item.category as any)?.name === activeCategory);
    }
    
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredItems(result);
  }, [activeCategory, searchQuery, menuItems]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-white to-orange-50 dark:from-stone-950 dark:to-stone-900">
        <Loader2 className="animate-spin text-gofoodie-orange mb-4" size={48} />
        <p className="text-stone-500 font-bold animate-pulse">Loading Delicious Menu...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-orange-50 dark:from-stone-950 dark:to-stone-900 min-h-screen relative overflow-hidden pb-20 transition-colors duration-300">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gofoodie-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER SECTION */}
      <div className="relative pt-20 pb-12 text-center px-4">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow bg-clip-text text-transparent">
              Our Delicious Menu
            </span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-base md:text-lg max-w-2xl mx-auto font-medium">
            Explore our wide selection of traditional dishes, cafe favorites, and more. Crafted with love, served with joy.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CLASSIC FILTERS & SEARCH (Stacked beautifully) */}
        <div className="mb-16">
          
          {/* 1. Centered Search Bar */}
          <div className="relative w-full max-w-2xl mx-auto mb-10">
            <Search className="absolute left-5 top-4 text-stone-400" size={22} />
            <input 
              type="text" 
              placeholder="Search for your favorite dish..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-lg transition-all text-lg"
            />
          </div>

          {/* 2. Wrapped Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-gofoodie-orange text-white shadow-[0_5px_15px_rgba(255,102,0,0.3)] transform scale-105' 
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-gofoodie-orange hover:text-gofoodie-orange'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MENU GRID */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-stone-900/50 rounded-3xl backdrop-blur-sm border border-stone-100 dark:border-stone-800">
            <Utensils size={64} className="mx-auto text-stone-300 dark:text-stone-700 mb-4" />
            <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">No dishes found</h3>
            <p className="text-stone-500">Try searching for something else or selecting a different category.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('All');}} 
              className="mt-6 text-gofoodie-orange font-bold hover:underline bg-orange-50 dark:bg-orange-900/30 px-6 py-2 rounded-full transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-stone-800 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(255,102,0,0.15)] transition-all duration-500 border border-stone-100 dark:border-stone-700 overflow-hidden group flex flex-col relative"
              >
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-gofoodie-orange text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  {(item.category as any)?.name || 'Food'}
                </div>

                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow relative bg-white dark:bg-stone-800">
                  <h3 className="text-xl font-black text-stone-900 dark:text-white mb-2 leading-tight">{item.name}</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm mb-6 line-clamp-2 flex-grow">{item.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-stone-100 dark:border-stone-700">
                    <span className="text-2xl font-black text-gofoodie-orange">
                      {item.price} <span className="text-xs font-bold text-stone-400 uppercase">ETB</span>
                    </span>
                    
                    <Link 
                      to={`/food/${item.id}`}
                      className="bg-gofoodie-orange text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-all shadow-md"
                    >
                      Order Now
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;