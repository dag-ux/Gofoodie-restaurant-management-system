import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Utensils, 
  ArrowUpRight, 
  Clock, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalTables: number;
  occupiedTables: number;
  totalMenuItems: number;
  recentOrders: any[];
}

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/admin/stats');
      setData(response.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
      setError("Failed to load dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ==========================================
  // SKELETON LOADING STATE
  // ==========================================
  if (loading) {
    return (
      <div className="animate-pulse pb-10">
        
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-lg w-64 mb-3"></div>
          <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-lg w-80"></div>
        </div>
        
        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-stone-900 rounded-3xl p-6 h-[170px] border border-stone-100 dark:border-stone-800 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-stone-200 dark:bg-stone-800 rounded-2xl"></div>
                <div className="w-16 h-6 bg-stone-200 dark:bg-stone-800 rounded-md"></div>
              </div>
              <div>
                <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-24 mb-2"></div>
                <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 overflow-hidden">
          <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
            <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-48"></div>
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 border-b border-stone-50 dark:border-stone-800/50 last:border-0">
                <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-20"></div>
                <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-40"></div>
                <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-24"></div>
                <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded-full w-24"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-6">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Oops! Something went wrong.</h2>
        <p className="text-stone-500 mb-6 max-w-md">{error}</p>
        <button 
          onClick={fetchStats}
          className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-6 py-3 rounded-xl font-bold hover:bg-gofoodie-orange dark:hover:bg-gofoodie-orange hover:text-white transition-all shadow-md flex items-center gap-2"
        >
          <RefreshCw size={18} /> Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  // ==========================================
  // ACTUAL DASHBOARD DATA
  // ==========================================
  return (
    <div className="pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white mb-2 tracking-tight">
            Dashboard <span className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow bg-clip-text text-transparent">Overview</span>
          </h1>
          <p className="text-stone-500 text-sm md:text-base">Here is what is happening at GooFoodie today.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-gofoodie-orange bg-white dark:bg-stone-800 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all"
        >
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Orders */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden relative group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gofoodie-orange to-orange-400"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3.5 rounded-2xl">
                <ShoppingBag className="text-gofoodie-orange" size={24} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-lg">
                <ArrowUpRight size={14} /> Live
              </span>
            </div>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">Total Orders</p>
            <p className="text-3xl font-black text-stone-900 dark:text-white">{data.totalOrders}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden relative group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3.5 rounded-2xl">
                <DollarSign className="text-green-500" size={24} />
              </div>
            </div>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-stone-900 dark:text-white">
              {data.totalRevenue.toLocaleString()} <span className="text-sm font-bold text-stone-400">ETB</span>
            </p>
          </div>
        </div>

        {/* Active Tables */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden relative group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3.5 rounded-2xl">
                <Users className="text-blue-500" size={24} />
              </div>
            </div>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">Active Tables</p>
            <p className="text-3xl font-black text-stone-900 dark:text-white">
              {data.occupiedTables} <span className="text-xl text-stone-400 font-bold">/ {data.totalTables}</span>
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden relative group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gofoodie-yellow to-yellow-400"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3.5 rounded-2xl">
                <Utensils className="text-gofoodie-yellow" size={24} />
              </div>
            </div>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">Menu Items</p>
            <p className="text-3xl font-black text-stone-900 dark:text-white">{data.totalMenuItems}</p>
          </div>
        </div>

      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Clock size={20} className="text-gofoodie-orange" /> Recent Orders
          </h2>
        </div>
        
        {/* Horizontal scroll for mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-stone-50 dark:bg-stone-800/50 text-stone-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-5 font-bold">Order ID</th>
                <th className="p-5 font-bold">Customer</th>
                <th className="p-5 font-bold">Total</th>
                <th className="p-5 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="p-5 font-bold text-stone-900 dark:text-white">#{order.id}</td>
                  <td className="p-5 text-stone-600 dark:text-stone-300 font-medium">{order.customerName}</td>
                  <td className="p-5 font-bold text-gofoodie-orange">{order.totalAmount} ETB</td>
                  <td className="p-5 text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {data.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-stone-500 font-medium">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;