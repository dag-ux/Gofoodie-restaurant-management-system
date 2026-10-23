import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Utensils, Play, Coffee, ArrowRight } from 'lucide-react';
import { getMenuItems } from '../api/menuApi';
import type { MenuItem } from '../api/menuApi';
import { useCartStore } from '../store/useCartStore';
import interiorImg from '../assets/interior design .png'; 

const HomePage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.7; 

    const fetchMenu = async () => {
      try {
        const data = await getMenuItems();
        setMenuItems(data.slice(0, 4)); // Top 4 signature dishes
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-stone-950 transition-colors duration-300 overflow-hidden">
      
      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black pt-20 pb-12 lg:pb-0">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-72 md:w-96 h-72 md:h-96 bg-gofoodie-orange/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-72 md:w-96 h-72 md:h-96 bg-gofoodie-yellow/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700 px-4 py-2 rounded-full text-xs md:text-sm font-bold text-stone-600 dark:text-stone-300 mb-6">
                <MapPin size={16} className="text-gofoodie-orange" /> Tulu Dimtu, Addis Ababa
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-r from-gofoodie-orange via-gofoodie-yellow to-gofoodie-orange bg-clip-text text-transparent inline-block">
                  Taste the Joy at
                </span>
                <br />
                <span className="text-gofoodie-orange">Goo</span>
                <span className="text-gofoodie-yellow">F</span>
                <span className="text-gofoodie-orange">oodie</span>
              </h1>
              
              <p className="text-base md:text-lg text-stone-600 dark:text-stone-400 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                From traditional Ethiopian dishes to freshly brewed coffee. Experience fine dining, takeout, or delivery right to your door.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link to="/menu" className="bg-gofoodie-orange text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_25px_rgba(255,102,0,0.3)] flex items-center justify-center gap-2">
                  <Utensils size={20} /> Explore Menu
                </Link>
                <a href="tel:0975114444" className="bg-white dark:bg-stone-800 text-stone-900 dark:text-white border-2 border-stone-200 dark:border-stone-700 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:border-gofoodie-orange hover:text-gofoodie-orange transition-all duration-300 flex items-center justify-center gap-2">
                  <Phone size={20} /> Call to Order
                </a>
              </div>
            </div>

            {/* Hero Video */}
            <div className="relative w-full max-w-md mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-gofoodie-orange to-gofoodie-yellow rounded-[2rem] md:rounded-[3rem] transform translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 opacity-20 blur-sm"></div>
              <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] max-h-[500px] lg:max-h-[600px] w-full group">
                <video ref={videoRef} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-2 shadow-lg z-10">
                   <div className="bg-gofoodie-orange p-1 md:p-1.5 rounded-full text-white"><Play size={12} fill="white" /></div>
                   <span className="text-[10px] md:text-xs font-bold text-stone-800 dark:text-white">Inside GooFoodie</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* OUR STORY SECTION */}
      <section className="py-20 md:py-24 bg-white dark:bg-stone-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            
            {/* Story Image */}
            <div className="relative w-full max-w-lg mx-auto md:max-w-none">
              <div className="absolute inset-0 bg-gofoodie-yellow rounded-3xl transform -rotate-3 scale-105 opacity-20"></div>
              <img 
                src={interiorImg} 
                alt="About GooFoodie" 
                className="relative rounded-3xl shadow-xl w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover" 
              />
              <div className="absolute -bottom-6 -right-4 md:-right-6 bg-gofoodie-orange text-white p-4 md:p-6 rounded-2xl shadow-xl hidden sm:block">
                <Coffee size={28} className="mb-1 md:mb-2" />
                <p className="font-bold text-lg md:text-xl">100%</p>
                <p className="text-xs md:text-sm opacity-90">Fresh Coffee</p>
              </div>
            </div>

            {/* Story Text */}
            <div className="text-center md:text-left mt-8 md:mt-0">
              {/* MIXED YELLOW AND ORANGE COLORS WITHOUT GRADIENT */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 dark:text-white mb-6 leading-[1.15]">
                <span className="text-gofoodie-orange">A Taste of</span> <span className="text-gofoodie-yellow">Tradition</span>, <br className="hidden sm:block"/>
                <span className="text-gofoodie-orange">Crafted with</span> <span className="text-gofoodie-yellow">Love.</span>
              </h2>
              
              <p className="text-base md:text-lg text-stone-500 dark:text-stone-400 leading-relaxed mb-6">
                At GooFoodie, we believe that food is more than just a meal—it's an experience. We bring together the rich, authentic flavors of traditional Ethiopian cuisine with the comfort of a modern cafe.
              </p>
              <p className="text-base md:text-lg text-stone-500 dark:text-stone-400 leading-relaxed mb-8">
                Whether you are joining us for a morning macchiato, a business lunch, or a family dinner, our dedicated team is here to ensure every moment is perfect.
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-6 md:gap-8">
                <div>
                  <p className="text-2xl md:text-3xl font-black text-stone-900 dark:text-white">4.3+</p>
                  <p className="text-xs md:text-sm font-bold text-stone-500 uppercase tracking-wide">Google Rating</p>
                </div>
                <div className="w-px h-10 md:h-12 bg-stone-200 dark:bg-stone-800"></div>
                <div>
                  <p className="text-2xl md:text-3xl font-black text-stone-900 dark:text-white">10k+</p>
                  <p className="text-xs md:text-sm font-bold text-stone-500 uppercase tracking-wide">Happy Customers</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SIGNATURE DISHES SECTION */}
      <section className="py-20 md:py-24 px-4 bg-gradient-to-b from-white to-orange-50 dark:from-stone-950 dark:to-stone-900 relative">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gofoodie-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-3 md:mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow bg-clip-text text-transparent">
                  Signature Dishes
                </span>
              </h2>
              <p className="text-stone-500 dark:text-stone-400 text-base md:text-lg font-medium">Our most loved meals, crafted to perfection.</p>
            </div>
            <Link to="/menu" className="inline-flex items-center gap-2 bg-white dark:bg-stone-800 text-gofoodie-orange border-2 border-gofoodie-orange/20 px-5 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-base md:text-lg hover:border-gofoodie-orange hover:bg-gofoodie-orange hover:text-white transition-all shadow-sm">
              View Full Menu <ArrowRight size={18} />
            </Link>
          </div>
          
          {loading ? (
            <p className="text-center text-gofoodie-orange font-bold animate-pulse text-lg md:text-xl py-10">Loading delicious food...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-stone-800 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(255,102,0,0.15)] transition-all duration-500 border border-stone-100 dark:border-stone-700 overflow-hidden group flex flex-col relative">
                  
                  <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-gofoodie-orange text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    {(item.category as any)?.name || 'Food'}
                  </div>

                  <div className="relative h-52 md:h-60 overflow-hidden">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-5 md:p-6 flex flex-col flex-grow relative bg-white dark:bg-stone-800">
                    <h3 className="text-lg md:text-xl font-black text-stone-900 dark:text-white mb-2">{item.name}</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mb-4 md:mb-6 line-clamp-2 flex-grow">{item.description}</p>
                    <div className="flex justify-between items-center mt-auto pt-3 md:pt-4 border-t border-stone-100 dark:border-stone-700">
                      <span className="text-xl md:text-2xl font-black text-gofoodie-orange">{item.price} <span className="text-[10px] md:text-xs font-bold text-stone-400 uppercase">ETB</span></span>
                      <button onClick={() => addToCart(item)} className="bg-gofoodie-orange/10 text-gofoodie-orange p-2.5 md:p-3 rounded-full hover:bg-gofoodie-orange hover:text-white transition-all duration-300 transform group-hover:rotate-90">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;