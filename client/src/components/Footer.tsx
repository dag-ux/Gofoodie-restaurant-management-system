import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand & About (Custom Text Logo) */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center mb-6">
              {/* Text Logo exactly as requested */}
              <div className="text-3xl font-black tracking-tighter">
                <span className="text-gofoodie-orange">GooF</span>
                <span className="text-gofoodie-yellow">oo</span>
                <span className="text-gofoodie-orange">die</span>
              </div>
            </div>
            
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6">
              Your favorite Cafe & Restaurant in Tulu Dimtu, Addis Ababa. Serving traditional Ethiopian dishes, freshly brewed coffee, and modern fast food with love.
            </p>
            
            <div className="flex gap-4">
              {/* Safe, generic icons to prevent crashes */}
              <a href="#" className="text-stone-400 hover:text-gofoodie-orange transition-colors" aria-label="Website"><Globe size={20} /></a>
              <a href="#" className="text-stone-400 hover:text-gofoodie-orange transition-colors" aria-label="Website"><Globe size={20} /></a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-stone-500 dark:text-stone-400 hover:text-gofoodie-orange transition-colors text-sm font-medium">Home</Link></li>
              <li><Link to="/menu" className="text-stone-500 dark:text-stone-400 hover:text-gofoodie-orange transition-colors text-sm font-medium">Our Menu</Link></li>
              <li><Link to="/about" className="text-stone-500 dark:text-stone-400 hover:text-gofoodie-orange transition-colors text-sm font-medium">About Us</Link></li>
              <li><Link to="/contact" className="text-stone-500 dark:text-stone-400 hover:text-gofoodie-orange transition-colors text-sm font-medium">Contact</Link></li>
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-gofoodie-orange shrink-0" />
                <span className="text-stone-500 dark:text-stone-400 text-sm">Tulu Dimtu, Addis Ababa, Ethiopia (Postal Code 1976)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-gofoodie-orange shrink-0" />
                <span className="text-stone-500 dark:text-stone-400 text-sm">+251 97 511 1444</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-gofoodie-orange shrink-0" />
                <span className="text-stone-500 dark:text-stone-400 text-sm">info@gofoodie.com</span>
              </li>
            </ul>
          </div>

          {/* 4. Opening Hours */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">Opening Hours</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock size={20} className="text-gofoodie-orange shrink-0 mt-1" />
                <div>
                  <p className="text-stone-900 dark:text-white font-bold text-sm">Monday - Sunday</p>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">7:00 AM - 11:30 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-200 dark:border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            &copy; {new Date().getFullYear()} GooFoodie Cafe & Restaurant. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-stone-500 dark:text-stone-400">
            <a href="#" className="hover:text-gofoodie-orange transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gofoodie-orange transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;