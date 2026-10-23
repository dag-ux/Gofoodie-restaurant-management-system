import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, Phone, User, CreditCard } from 'lucide-react';
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
    navigate('/cart');
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

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <CheckCircle2 size={80} className="text-green-500 mb-6" />
        <h1 className="text-4xl font-extrabold text-stone-900 mb-4">Order Confirmed!</h1>
        <p className="text-stone-500 text-lg mb-8 text-center max-w-md">
          Thank you, {formData.customerName}. Your order has been received and is being prepared.
        </p>
        <Link to="/" className="bg-gofoodie-orange text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link to="/cart" className="inline-flex items-center gap-2 text-stone-500 hover:text-gofoodie-orange font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Cart
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-6">Checkout</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-3">Order Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['DELIVERY', 'TAKEOUT', 'DINE_IN'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, orderType: type })}
                    className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                      formData.orderType === type
                        ? 'border-gofoodie-orange bg-orange-50 text-gofoodie-orange'
                        : 'border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                <User size={16} /> Full Name
              </label>
              <input required type="text" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-white" placeholder="Abebe Bikila" />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                <Phone size={16} /> Phone Number
              </label>
              <input required type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-white" placeholder="0911223344" />
            </div>

            {formData.orderType === 'DELIVERY' && (
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Delivery Address
                </label>
                <textarea required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-white" rows={3} placeholder="Tulu Dimtu, Block 4..."></textarea>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? 'Placing Order...' : <><CreditCard size={20} /> Confirm Order</>}
            </button>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="bg-stone-100 text-stone-600 font-bold text-sm w-8 h-8 flex items-center justify-center rounded-lg">{item.quantity}x</span>
                    <span className="font-medium text-stone-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-stone-900">{item.price * item.quantity} ETB</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-stone-100 pt-4">
              <div className="flex justify-between items-center mb-4 text-stone-500">
                <span>Delivery Fee</span>
                <span className="text-green-500 font-bold">Free</span>
              </div>
              <div className="flex justify-between items-center text-xl font-extrabold text-stone-900">
                <span>Total</span>
                <span className="text-gofoodie-orange">{totalPrice} ETB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;