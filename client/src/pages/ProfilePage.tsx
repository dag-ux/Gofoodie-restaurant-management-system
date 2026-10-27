import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, XCircle, ChefHat, Truck, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getMyOrders } from '../api/orderApi';

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  menuItem: { name: string };
}

interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
  orderType: string;
  createdAt: string;
  items: OrderItem[];
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING': return { icon: <Clock size={16} />, color: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400' };
      case 'PREPARING': return { icon: <ChefHat size={16} />, color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' };
      case 'READY': return { icon: <Package size={16} />, color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400' };
      case 'COMPLETED': return { icon: <CheckCircle2 size={16} />, color: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' };
      case 'CANCELLED': return { icon: <XCircle size={16} />, color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' };
      default: return { icon: <Clock size={16} />, color: 'text-stone-600 bg-stone-50 border-stone-200' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gofoodie-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* User Profile Card */}
        <div className="bg-white dark:bg-stone-900 rounded-[2rem] shadow-xl border border-stone-100 dark:border-stone-800 p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-tr from-gofoodie-orange to-gofoodie-yellow rounded-full flex items-center justify-center text-white shadow-lg">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-900 dark:text-white">{user?.name}</h1>
              <p className="text-stone-500 font-medium">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-100"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Order History */}
        <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-6 flex items-center gap-2">
          <Package className="text-gofoodie-orange" /> Your Order History
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <Package size={64} className="mx-auto text-stone-300 dark:text-stone-700 mb-4" />
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No orders yet</h3>
            <p className="text-stone-500 mb-6">You haven't placed any orders with us.</p>
            <button onClick={() => navigate('/menu')} className="bg-gofoodie-orange text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusDisplay(order.status);
              
              return (
                <div key={order.id} className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
                  
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/20">
                    <div>
                      <p className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-1">Order #{order.id}</p>
                      <p className="text-xs text-stone-400 flex items-center gap-1">
                        <Clock size={12} /> {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center gap-4">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${statusInfo.color}`}>
                        {statusInfo.icon} {order.status}
                      </span>
                      <span className="text-lg font-black text-gofoodie-orange">{order.totalAmount} ETB</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {order.orderType === 'DELIVERY' ? <Truck size={16} className="text-stone-400" /> : <Package size={16} className="text-stone-400" />}
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{order.orderType.replace('_', ' ')}</span>
                    </div>
                    <ul className="space-y-2">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-stone-700 dark:text-stone-300">
                            <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-xs font-bold mr-2">{item.quantity}x</span>
                            {item.menuItem?.name || 'Unknown Item'}
                          </span>
                          <span className="font-bold text-stone-900 dark:text-white">{item.unitPrice * item.quantity} ETB</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;