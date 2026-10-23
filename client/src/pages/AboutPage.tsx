import { MapPin, Phone, Clock, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <h1 className="text-4xl font-extrabold text-stone-900 dark:text-white text-center mb-12">Our Story</h1>
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop" alt="Restaurant" className="rounded-3xl shadow-lg w-full h-80 object-cover" />
        <div>
          <p className="text-lg text-stone-600 dark:text-stone-300 mb-6 leading-relaxed">
            Welcome to GoofFoodie, your favorite cafe and restaurant in Tulu Dimtu, Addis Ababa. We are passionate about bringing you the authentic taste of Ethiopia, combined with a modern, cozy atmosphere.
          </p>
          <p className="text-lg text-stone-600 dark:text-stone-300 mb-6 leading-relaxed">
            From our traditional Doro Wat and Kitfo to freshly brewed macchiatos, every dish is prepared with love and the finest ingredients.
          </p>
          <ul className="space-y-3 text-stone-700 dark:text-stone-300 font-medium">
            <li className="flex items-center gap-2"><CheckCircle size={18} className="text-gofoodie-orange" /> Dine-in & Takeaway</li>
            <li className="flex items-center gap-2"><CheckCircle size={18} className="text-gofoodie-orange" /> Free Parking Lot</li>
            <li className="flex items-center gap-2"><CheckCircle size={18} className="text-gofoodie-orange" /> Good for Kids & Groups</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default AboutPage;