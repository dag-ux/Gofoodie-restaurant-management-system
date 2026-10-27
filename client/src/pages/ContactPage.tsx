import { MapPin, Phone, Clock,  Send, Video, ExternalLink } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black py-10 md:py-16 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black mb-3 bg-gradient-to-r from-gofoodie-orange via-gofoodie-yellow to-gofoodie-orange bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base max-w-xl mx-auto">
            Have a question, want to place a large order, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white dark:bg-stone-900 rounded-[2rem] shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden grid md:grid-cols-2">
          
          {/* Left Column: Info & Socials */}
          <div className="p-6 md:p-10 flex flex-col justify-center relative overflow-hidden">
            {/* Background Blur Decor */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-gofoodie-orange/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10 space-y-6">
              
              {/* Contact Details */}
              <div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-5">Contact Details</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 text-stone-600 dark:text-stone-300">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl shrink-0">
                      <MapPin className="text-gofoodie-orange" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-900 dark:text-white">Location</p>
                      <p className="text-sm">Tulu Dimtu, Addis Ababa, Ethiopia</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 text-stone-600 dark:text-stone-300">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl shrink-0">
                      <Phone className="text-gofoodie-orange" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-900 dark:text-white">Phone</p>
                      <p className="text-sm">097 511 1444</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 text-stone-600 dark:text-stone-300">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl shrink-0">
                      <Clock className="text-gofoodie-orange" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-900 dark:text-white">Opening Hours</p>
                      <p className="text-sm">Monday - Sunday: 7:00 AM - 11:30 PM</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border-t border-stone-100 dark:border-stone-800 pt-6"></div>

              {/* Social Channels */}
              <div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">Follow Us</h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">Stay updated with our latest dishes and offers.</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Telegram */}
                  <a 
                    href="https://t.me/Gofoodie_restaurant_cafe" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl border border-blue-100 dark:border-blue-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Send className="text-blue-500" size={20} />
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Telegram</span>
                    </div>
                    <ExternalLink size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </a>

                  {/* TikTok (Placeholder link) */}
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl border border-stone-200 dark:border-stone-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Video className="text-stone-800 dark:text-stone-200" size={20} />
                      <span className="text-sm font-bold text-stone-800 dark:text-stone-200">TikTok</span>
                    </div>
                    <ExternalLink size={16} className="text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Google Maps */}
          <div className="relative min-h-[400px] md:min-h-full bg-stone-100 dark:bg-stone-800">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15762.83584057099!2d38.80255123955078!3d8.871015799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b792652d19a8b%3A0x51659caca0d38df5!2sGofoodie%20Ethiopia%20cafe%20and%20restaurant!5e0!3m2!1sen!2set!4v1710000000000!5m2!1sen!2set" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', inset: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="GooFoodie Location"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;