import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { cart, isCartOpen, toggleCart, removeFromCart, getTotalPrice, getTotalItems } = useCartStore();
  
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={toggleCart}
      ></div>

      {/* Sliding Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col animate-slide-left">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
          <h2 className="text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="text-gofoodie-orange" /> Your Order ({totalItems})
          </h2>
          <button onClick={toggleCart} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-stone-500 py-10">Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-stone-50 dark:bg-stone-800/50 p-3 rounded-2xl border border-stone-100 dark:border-stone-800">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-stone-900 dark:text-white">{item.name}</h3>
                  <p className="text-gofoodie-orange font-black text-sm">{item.price} ETB</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="text-sm font-bold bg-white dark:bg-stone-900 px-3 py-1 rounded-lg border border-stone-200 dark:border-stone-700">Qty: {item.quantity}</span>
                   <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
            <div className="flex justify-between items-center mb-6">
              <span className="text-stone-500 font-bold">Total Amount</span>
              <span className="text-3xl font-black text-gofoodie-orange">{totalPrice} ETB</span>
            </div>
            <button 
              onClick={() => { toggleCart(); navigate('/checkout'); }}
              className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-4 rounded-xl font-black text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;