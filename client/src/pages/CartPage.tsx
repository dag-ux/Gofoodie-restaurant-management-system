import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const CartPage = () => {
  const { cart, removeFromCart, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-4 text-center">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Your cart is empty</h2>
        <p className="text-stone-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="bg-gofoodie-orange text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors inline-flex items-center gap-2">
          <ArrowLeft size={20} /> Go back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold text-stone-900 mb-8">Your Order</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 mb-8">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-4 border-b border-stone-100 last:border-0">
            <div className="flex items-center gap-4">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
              <div>
                <h3 className="font-bold text-lg text-stone-900">{item.name}</h3>
                <p className="text-stone-500">{item.price} ETB x {item.quantity}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-extrabold text-gofoodie-orange text-xl">{item.price * item.quantity} ETB</span>
              <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition-colors p-2">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-stone-500 mb-1">Total Amount</p>
          <p className="text-3xl font-extrabold text-gofoodie-orange">{totalPrice} ETB</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button onClick={clearCart} className="px-6 py-3 font-bold text-stone-500 hover:text-stone-800 transition-colors">
            Clear Cart
          </button>
          <button className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none">
            <CreditCard size={20} /> Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;