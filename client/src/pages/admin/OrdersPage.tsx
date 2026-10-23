import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  Loader2, 
  Phone, 
  MapPin, 
  User, 
  RefreshCw 
} from 'lucide-react';

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  menuItem: {
    name: string;
  };
}

interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  orderType: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchOrders = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    try {
      const response = await axiosClient.get('/orders');
      const sortedOrders = response.data.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds for live orders
    const interval = setInterval(() => fetchOrders(false), 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await axiosClient.put(`/orders/${id}/status`, { status });
      setToast({ type: 'success', message: `Order #${id} marked as ${status}` });
      fetchOrders(); 
    } catch (error) {
      console.error("Failed to update status", error);
      setToast({ type: 'error', message: 'Failed to update order status.' });
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const filteredOrders = orders.filter(o => filterStatus === 'ALL' ? true : o.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'PREPARING': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'READY': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin text-gofoodie-orange mb-4" size={40} />
        <p className="text-stone-500 font-bold animate-pulse text-sm">Loading Live Orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 relative">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border animate-slide-in ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-800 dark:text-green-300' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-1">
            Order <span className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-stone-500 text-sm">Manage incoming customer orders in real-time.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Refresh Button */}
          <button 
            onClick={() => fetchOrders(true)}
            className="p-2.5 bg-white dark:bg-stone-800 text-stone-500 border border-stone-200 dark:border-stone-700 rounded-xl hover:text-gofoodie-orange hover:shadow-md transition-all hidden sm:block"
            title="Refresh Orders"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
            {['ALL', 'PENDING', 'PREPARING', 'READY', 'COMPLETED'].map(status => (
              <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  filterStatus === status 
                    ? 'bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white shadow-md transform scale-105' 
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-gofoodie-orange hover:text-gofoodie-orange'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <Clock size={56} className="mx-auto text-stone-300 dark:text-stone-700 mb-4" />
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-1">No orders found</h3>
            <p className="text-stone-500 text-sm max-w-sm mx-auto">When customers place orders, or if you change the filter, they will appear here.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden transition-all duration-300 hover:shadow-md">
              
              {/* SUMMARY ROW */}
              <div 
                onClick={() => toggleExpand(order.id)}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-5 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="bg-stone-100 dark:bg-stone-800 px-3 py-2 rounded-xl font-bold text-stone-500 dark:text-stone-400 text-sm">
                    #{order.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-white text-base">{order.customerName}</h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <Clock size={12} /> {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-6">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{order.orderType.replace('_', ' ')}</span>
                    <span className="text-xl font-extrabold text-gofoodie-orange">{order.totalAmount} <span className="text-xs text-stone-400">ETB</span></span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <div className="bg-stone-100 dark:bg-stone-800 p-1.5 rounded-full text-stone-500 transition-transform duration-300" style={{ transform: expandedOrder === order.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {expandedOrder === order.id && (
                <div className="border-t border-stone-100 dark:border-stone-800 p-4 md:p-5 bg-stone-50/50 dark:bg-stone-900/50 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Ordered Items */}
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-white mb-3 text-sm md:text-base flex items-center gap-2">
                        <CheckCircle size={18} className="text-gofoodie-orange"/> Items to Prepare
                      </h4>
                      <ul className="space-y-2 mb-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 p-3 md:p-4 shadow-sm">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex justify-between items-center text-xs md:text-sm border-b border-stone-50 dark:border-stone-700/50 last:border-0 pb-2 last:pb-0">
                            <span className="font-bold text-stone-700 dark:text-stone-300">
                              <span className="bg-gofoodie-orange/10 text-gofoodie-orange px-1.5 py-0.5 rounded mr-2">{item.quantity}x</span>
                              {item.menuItem?.name || 'Unknown Item'}
                            </span>
                            <span className="font-bold text-stone-900 dark:text-white">{item.unitPrice * item.quantity} ETB</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Customer Info & Status Update */}
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-white mb-3 text-sm md:text-base flex items-center gap-2">
                         <User size={18} className="text-gofoodie-orange"/> Customer Details
                      </h4>
                      <div className="bg-white dark:bg-stone-800 p-4 rounded-xl border border-stone-100 dark:border-stone-700 space-y-2 mb-4 shadow-sm">
                        <p className="flex items-center gap-2 text-xs md:text-sm text-stone-700 dark:text-stone-200 font-medium"><User size={16} className="text-stone-400"/> {order.customerName}</p>
                        <p className="flex items-center gap-2 text-xs md:text-sm text-stone-700 dark:text-stone-200 font-medium"><Phone size={16} className="text-stone-400"/> {order.phone}</p>
                        {order.orderType === 'DELIVERY' && order.address && (
                          <p className="flex items-start gap-2 text-xs md:text-sm text-stone-700 dark:text-stone-200 font-medium"><MapPin size={16} className="text-stone-400 mt-0.5"/> {order.address}</p>
                        )}
                      </div>

                      <h4 className="font-bold text-stone-900 dark:text-white mb-2 text-xs uppercase tracking-wider">Update Order Status</h4>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => updateStatus(order.id, 'PREPARING')} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors shadow-sm">Preparing</button>
                        <button onClick={() => updateStatus(order.id, 'READY')} className="px-4 py-2 bg-purple-500 text-white rounded-lg text-xs font-bold hover:bg-purple-600 transition-colors shadow-sm">Ready</button>
                        <button onClick={() => updateStatus(order.id, 'COMPLETED')} className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors shadow-sm">Complete</button>
                        <button onClick={() => updateStatus(order.id, 'CANCELLED')} className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Cancel</button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;