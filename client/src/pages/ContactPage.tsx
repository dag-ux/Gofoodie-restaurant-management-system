import { MapPin, Phone, Clock, Mail } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <h1 className="text-4xl font-extrabold text-stone-900 dark:text-white text-center mb-12">Contact Us</h1>
      <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-lg border border-stone-100 dark:border-stone-800">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">Get in Touch</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-gofoodie-orange shrink-0" />
                <span className="text-stone-600 dark:text-stone-300">Tulu Dimtu, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="text-gofoodie-orange shrink-0" />
                <span className="text-stone-600 dark:text-stone-300">097 511 1444</span>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="text-gofoodie-orange shrink-0" />
                <span className="text-stone-600 dark:text-stone-300">Open Daily: 7:00 AM - 11:30 PM</span>
              </li>
            </ul>
          </div>
          <div className="bg-stone-100 dark:bg-stone-800 rounded-2xl h-64 flex items-center justify-center text-stone-500">
            <p>Map integration placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactPage;