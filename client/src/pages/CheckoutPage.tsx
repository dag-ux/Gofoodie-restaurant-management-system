import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, Phone, User, CreditCard, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { createOrder } from '../api/orderApi';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    orderType: 'DELIVERY',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (cart.length === 0 && !isSuccess) {
    navigate('/menu');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formattedCartItems = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      await createOrder({
        ...formData,
        totalAmount: totalPrice,
        cartItems: formattedCartItems,
      });

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error(error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-orange-50 dark:from-stone-950 dark:to-stone-900 transition-colors duration-300">
        <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[2rem] shadow-2xl border border-stone-100 dark:border-stone-800 max-w-lg w-full text-center">
          <div className="bg-green-100 dark:bg-green-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-white mb-4">Order Confirmed!</h1>
          <p className="text-stone-500 dark:text-stone-400 text-base md:text-lg mb-8">
            Thank you, <span className="font-bold text-stone-800 dark:text-stone-200">{formData.customerName}</span>. Your order has been received and is being prepared.
          </p>
          <Link to="/menu" className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2">
            Order More Food
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-stone-950 dark:to-stone-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-stone-500 hover:text-gofoodie-orange font-bold mb-8 transition-colors bg-white dark:bg-stone-800 px-4 py-2 rounded-full shadow-sm">
          <ArrowLeft size={18} /> Back to Menu
        </button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          
          {/* LEFT COLUMN: FORM */}
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-white mb-2 tracking-tight">
              Secure <span className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow bg-clip-text text-transparent">Checkout</span>
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mb-8">Please provide your details to complete the order.</p>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 p-6 md:p-8 rounded-[2rem] shadow-xl border border-stone-100 dark:border-stone-800 space-y-6">
              
              {/* Order Type */}
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-widest">Order Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['DELIVERY', 'TAKEOUT', 'DINE_IN'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, orderType: type })}
                      className={`py-3 rounded-xl border-2 font-bold text-xs md:text-sm transition-all ${
                        formData.orderType === type
                          ? 'border-gofoodie-orange bg-orange-50 dark:bg-orange-900/20 text-gofoodie-orange'
                          : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} /> Full Name
                </label>
                <input 
                  required 
                  type="text" 
                  value={formData.customerName} 
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} 
                  className="w-full px-4 py-3.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white transition-all" 
                  placeholder="Abebe Bikila" 
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={14} /> Phone Number
                </label>
                <input 
                  required 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  className="w-full px-4 py-3.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white transition-all" 
                  placeholder="0911223344" 
                />
              </div>

              {/* Address (Only for Delivery) */}
              {formData.orderType === 'DELIVERY' && (
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> Delivery Address
                  </label>
                  <textarea 
                    required 
                    value={formData.address} 
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                    className="w-full px-4 py-3.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white transition-all resize-none" 
                    rows={3} 
                    placeholder="Tulu Dimtu, Block 4..."
                  ></textarea>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-4 rounded-xl font-black text-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_10px_25px_rgba(255,102,0,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing...' : <><CreditCard size={20} /> Confirm Order - {totalPrice} ETB</>}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div>
            <div className="bg-white dark:bg-stone-900 p-6 md:p-8 rounded-[2rem] shadow-xl border border-stone-100 dark:border-stone-800 sticky top-28">
              <h2 className="text-xl font-black text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="text-gofoodie-orange" /> Order Summary
              </h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-100 dark:border-stone-700/50">
                    <div className="flex items-center gap-3">
                      <span className="bg-gofoodie-orange/10 text-gofoodie-orange font-black text-xs w-7 h-7 flex items-center justify-center rounded-md">{item.quantity}x</span>
                      <span className="font-bold text-sm text-stone-800 dark:text-stone-200">{item.name}</span>
                    </div>
                    <span className="font-black text-sm text-stone-900 dark:text-white">{item.price * item.quantity} ETB</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-stone-100 dark:border-stone-800 pt-4">
                <div className="flex justify-between items-center mb-3 text-sm font-bold text-stone-500 dark:text-stone-400">
                  <span>Delivery Fee</span>
                  <span className="text-green-500 uppercase tracking-wider text-xs">Free</span>
                </div>
                <div className="flex justify-between items-center text-xl font-black text-stone-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-gofoodie-orange">{totalPrice} ETB</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;