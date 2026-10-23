import { CheckCircle, Coffee, MapPin, Clock } from 'lucide-react';
import interiorImg from '../assets/interior design .png'; 

const AboutPage = () => {
  return (
    <main className="relative min-h-screen w-full bg-stone-950 overflow-hidden flex items-center">
      
      {/* 1. Full Background Image */}
      <img 
        src={interiorImg} 
        alt="GooFoodie Restaurant Interior" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* 2. Modern Cinematic Gradient Overlay */}
      {/* This makes the left side dark for text readability, but reveals the image on the right side */}
      <aside className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-transparent md:bg-gradient-to-r md:from-stone-950 md:via-stone-900/80 md:to-transparent"></aside>

      {/* 3. Content Container */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:px-12 lg:px-20">
        
        <article className="max-w-2xl">
          
          {/* Header / Title */}
          <header className="mb-8">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-widest mb-6 border border-white/20 shadow-lg">
              <Coffee size={14} className="text-gofoodie-yellow" /> 
              Est. 2024
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter leading-[1.1] text-white drop-shadow-2xl">
              Our <span className="bg-gradient-to-r from-gofoodie-orange via-gofoodie-yellow to-gofoodie-orange bg-clip-text text-transparent">Story</span>
            </h1>
            
            <h2 className="text-xl md:text-3xl font-bold text-stone-300">
              A Taste of Tradition, <br/>
              <span className="text-gofoodie-orange">Crafted with Love.</span>
            </h2>
          </header>

          {/* Body Text */}
          <div className="space-y-6 mb-12">
            <p className="text-stone-300 text-base md:text-lg leading-relaxed drop-shadow-md">
              Welcome to GooFoodie, your favorite cafe and restaurant in Tulu Dimtu, Addis Ababa. We are passionate about bringing you the authentic taste of Ethiopia, combined with a modern, cozy atmosphere.
            </p>
            <p className="text-stone-300 text-base md:text-lg leading-relaxed drop-shadow-md">
              From our traditional Doro Wat and Kitfo to freshly brewed macchiatos, every dish is prepared with love and the finest ingredients.
            </p>
          </div>

          {/* Modern Features List */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="flex items-center gap-3 text-white font-medium bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <CheckCircle size={20} className="text-gofoodie-yellow shrink-0" />
              Dine-in & Takeaway
            </li>
            <li className="flex items-center gap-3 text-white font-medium bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <CheckCircle size={20} className="text-gofoodie-yellow shrink-0" />
              Free Parking Lot
            </li>
            <li className="flex items-center gap-3 text-white font-medium bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <CheckCircle size={20} className="text-gofoodie-yellow shrink-0" />
              Family Friendly
            </li>
            <li className="flex items-center gap-3 text-white font-medium bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <CheckCircle size={20} className="text-gofoodie-yellow shrink-0" />
              Great for Groups
            </li>
          </ul>

          {/* Bottom Info Bar */}
          <footer className="mt-12 flex flex-wrap items-center gap-6 text-sm font-bold text-stone-400">
            <span className="flex items-center gap-2"><MapPin size={16} className="text-gofoodie-orange"/> Tulu Dimtu, Addis Ababa</span>
            <span className="flex items-center gap-2"><Clock size={16} className="text-gofoodie-orange"/> 7:00 AM - 11:30 PM</span>
          </footer>

        </article>
      </section>
    </main>
  );
};

export default AboutPage;