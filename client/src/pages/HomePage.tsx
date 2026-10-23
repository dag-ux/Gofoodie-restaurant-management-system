import { useEffect, useState } from 'react';
import { Phone, Plus, MapPin, Coffee } from 'lucide-react';
import { getMenuItems } from '../api/menuApi'; 
import type { MenuItem } from '../api/menuApi';
import { useCartStore } from '../store/useCartStore'; 

const HomePage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  return (
    <>
      <header className="relative bg-stone-900 text-white py-32">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4">
          <div className="flex justify-center mb-6">
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-white/20">
              <MapPin size={16} className="text-gofoodie-yellow" /> Tulu Dimtu, Addis Ababa
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Taste the Joy at <br />
            <span className="text-gofoodie-yellow">GoofFoodie</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            From traditional Ethiopian dishes to freshly brewed coffee. Experience fine dining, takeout, or delivery right to your door.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#menu" className="bg-gofoodie-orange text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center gap-2">
              <Coffee size={20} /> Explore Menu
            </a>
            <a href="tel:0975114444" className="bg-white text-stone-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-stone-100 transition-all shadow-lg flex items-center justify-center gap-2">
              <Phone size={20} className="text-gofoodie-orange" /> Call to Order
            </a>
          </div>
        </div>
      </header>

      <main id="menu" className="max-w-7xl mx-auto py-24 px-4">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-stone-900 mb-4">Our Signature Menu</h2>
            <p className="text-stone-500 font-medium">Crafted with love, served with joy.</p>
         </div>
         
         {loading ? (
           <p className="text-center font-bold text-gofoodie-orange text-xl animate-pulse">Loading delicious food...</p>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {menuItems.map((item) => (
               <div key={item.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 overflow-hidden group">
                 <div className="relative overflow-hidden h-56">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-stone-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                       {item.category}
                    </span>
                 </div>
                 <div className="p-6">
                   <h3 className="text-xl font-bold text-stone-900 mb-2">{item.name}</h3>
                   <p className="text-stone-500 text-sm mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
                   <div className="flex justify-between items-center mt-auto">
                     <span className="text-2xl font-extrabold text-gofoodie-orange">{item.price} <span className="text-sm text-stone-500">ETB</span></span>
                     <button onClick={() => addToCart(item)} className="bg-stone-100 text-stone-900 p-3 rounded-full hover:bg-gofoodie-orange hover:text-white transition-colors duration-300 active:scale-95">
                       <Plus size={20} strokeWidth={3} />
                     </button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         )}
      </main>
    </>
  );
};

export default HomePage;