import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import { getMenuItemById } from '../api/menuApi';
import type { MenuItem } from '../api/menuApi';
import { useCartStore } from '../store/useCartStore';

const FoodDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (id) {
          const data = await getMenuItemById(id);
          setItem(data);
        }
      } catch (error) {
        console.error("Failed to load item", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-orange-50 dark:from-stone-950 dark:to-stone-900">
        <Loader2 className="animate-spin text-gofoodie-orange" size={48} />
      </div>
    );
  }

  if (!item) {
    return <div className="text-center py-20 text-2xl font-bold text-stone-500">Dish not found</div>;
  }

  const handleOrderNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    navigate('/checkout'); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black py-8 md:py-16 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-stone-500 hover:text-gofoodie-orange font-bold mb-6 md:mb-8 transition-colors bg-white dark:bg-stone-800 px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="bg-white dark:bg-stone-900 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden grid md:grid-cols-2">
          
          {/* Left Side: Image */}
          <div className="relative h-[300px] md:h-full min-h-[400px]">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-none"></div>
            <div className="absolute top-6 left-6 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black text-gofoodie-orange uppercase tracking-widest shadow-lg">
              {(item.category as any)?.name || 'Food'}
            </div>
          </div>

          {/* Right Side: Details & Action */}
          <div className="p-8 md:p-12 flex flex-col justify-center relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gofoodie-yellow/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-gofoodie-yellow" size={20} />
                <span className="text-sm font-bold text-stone-400 uppercase tracking-wider">Chef's Special</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-stone-900 dark:text-white mb-4 leading-[1.1]">
                {item.name}
              </h1>
              
              <p className="text-base md:text-lg text-stone-500 dark:text-stone-400 leading-relaxed mb-8">
                {item.description}
              </p>

              <div className="text-3xl md:text-4xl font-black text-gofoodie-orange mb-8">
                {item.price} <span className="text-base text-stone-400 font-bold uppercase">ETB</span>
              </div>

              {/* Quantity Dropdown */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-widest">
                  Select Quantity
                </label>
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full md:w-48 px-4 py-3.5 rounded-xl border-2 border-stone-200 dark:border-stone-700 focus:outline-none focus:border-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-bold text-lg cursor-pointer transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Item' : 'Items'}</option>
                  ))}
                </select>
              </div>

              {/* Order Button */}
              <button 
                onClick={handleOrderNow}
                className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl hover:opacity-90 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_25px_rgba(255,102,0,0.3)] flex items-center justify-center gap-3"
              >
                <ShoppingBag size={22} /> Order Now - {(item.price * quantity).toLocaleString()} ETB
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FoodDetailsPage;