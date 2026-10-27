import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Users, CheckCircle, RefreshCw, Loader2, Crown, Plus, X, Wrench, Check } from 'lucide-react';

interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  status: string; // FREE, RESERVED, OCCUPIED, OUT_OF_SERVICE
}

const AdminTablesPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Add Table Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('2');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTables = async () => {
    try {
      const response = await axiosClient.get('/tables');
      setTables(response.data);
    } catch (error) {
      console.error("Failed to fetch tables", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await axiosClient.put(`/tables/${id}/status`, { status });
      setToast({ type: 'success', message: `Table marked as ${status.replace('_', ' ')}` });
      fetchTables();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to update table status.' });
    }
  };

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosClient.post('/tables', {
        tableNumber: newTableNumber,
        capacity: Number(newTableCapacity),
      });
      setToast({ type: 'success', message: 'New table added successfully!' });
      setIsAddModalOpen(false);
      setNewTableNumber('');
      setNewTableCapacity('2');
      fetchTables();
    } catch (error: any) {
      setToast({ type: 'error', message: error.response?.data?.error || 'Failed to add table.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin text-gofoodie-orange mb-4" size={40} />
        <p className="text-stone-500 font-bold animate-pulse">Loading Restaurant Floor...</p>
      </div>
    );
  }

  // Separate VIP and Regular Tables
  const vipTables = tables.filter(t => t.tableNumber.toUpperCase().startsWith('VIP'));
  const regularTables = tables.filter(t => !t.tableNumber.toUpperCase().startsWith('VIP'));

  // Group regular tables by capacity
  const groupedRegularTables = regularTables.reduce((acc, table) => {
    if (!acc[table.capacity]) acc[table.capacity] = [];
    acc[table.capacity].push(table);
    return acc;
  }, {} as Record<number, Table[]>);

  const sortedCapacities = Object.keys(groupedRegularTables).map(Number).sort((a, b) => a - b);

  // ==========================================
  // REUSABLE TABLE CARD (Clean & Minimal)
  // ==========================================
  const renderTableCard = (table: Table) => {
    const isFree = table.status === 'FREE';
    const isOccupied = table.status === 'OCCUPIED';
    const isReserved = table.status === 'RESERVED';
    const isOutOfService = table.status === 'OUT_OF_SERVICE';

    return (
      <div 
        key={table.id} 
        className={`relative bg-white dark:bg-stone-900 rounded-2xl p-5 border shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between h-44 overflow-hidden ${
          isOutOfService ? 'border-stone-200 dark:border-stone-800 opacity-60 grayscale' :
          isOccupied ? 'border-red-200 dark:border-red-900/50' :
          isReserved ? 'border-yellow-300 dark:border-yellow-700/50' :
          'border-stone-200 dark:border-stone-800 hover:border-gofoodie-orange/50'
        }`}
      >
        {/* Left color accent bar */}
        <div className={`absolute top-0 left-0 w-1.5 h-full ${
          isOutOfService ? 'bg-stone-300 dark:bg-stone-700' :
          isOccupied ? 'bg-red-500' :
          isReserved ? 'bg-gofoodie-yellow' :
          'bg-gofoodie-orange'
        }`}></div>

        <div className="pl-2">
          <div className="flex justify-between items-start mb-1">
            <h3 className={`text-2xl font-black ${isOutOfService ? 'text-stone-400 line-through' : 'text-stone-900 dark:text-white'}`}>
              {table.tableNumber}
            </h3>
            
            {/* Status Pill (Soft colors) */}
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider border ${
              isOutOfService ? 'bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:border-stone-700' :
              isOccupied ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' :
              isReserved ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-500 dark:border-yellow-900/50' :
              'bg-orange-50 text-gofoodie-orange border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50'
            }`}>
              {table.status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-bold">
            <Users size={14} /> Seats {table.capacity}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-2 relative z-10 mt-auto pl-2">
          {isFree && (
            <>
              <button 
                onClick={() => handleUpdateStatus(table.id, 'OCCUPIED')} 
                className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-2 rounded-xl text-xs font-bold hover:bg-gofoodie-orange dark:hover:bg-gofoodie-orange hover:text-white transition-all shadow-sm"
              >
                Seat Walk-in
              </button>
              <button 
                onClick={() => handleUpdateStatus(table.id, 'OUT_OF_SERVICE')} 
                className="w-full flex items-center justify-center gap-1 bg-transparent text-stone-400 hover:text-red-500 py-1 rounded-lg text-[10px] font-bold transition-colors"
              >
                <Wrench size={12} /> Out of Service
              </button>
            </>
          )}
          
          {isOccupied && (
            <button 
              onClick={() => handleUpdateStatus(table.id, 'FREE')} 
              className="w-full bg-green-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-green-600 transition-colors shadow-sm"
            >
              Clear Table
            </button>
          )}
          
          {isReserved && (
            <div className="w-full text-center py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 rounded-xl text-xs font-bold border border-yellow-200 dark:border-yellow-800">
              Awaiting Arrival
            </div>
          )}
          
          {isOutOfService && (
            <button 
              onClick={() => handleUpdateStatus(table.id, 'FREE')} 
              className="w-full flex items-center justify-center gap-1 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 py-2 rounded-xl text-xs font-bold hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
            >
              <Check size={14} /> Fix Table
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 relative">
      
      {/* TOAST */}
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border animate-slide-in ${
          toast.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <CheckCircle size={18} />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* HEADER & ADD BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-1">
            Restaurant <span className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow bg-clip-text text-transparent">Floor</span>
          </h1>
          <p className="text-stone-500 text-sm">Manage live table statuses. Click to seat or clear tables.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchTables} className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-gofoodie-orange bg-white dark:bg-stone-800 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm transition-all">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 text-sm font-bold text-white bg-gofoodie-orange hover:bg-orange-600 px-4 py-2.5 rounded-xl shadow-md transition-all">
            <Plus size={16} /> Add Table
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* VIP SECTION (Elegant Dark Theme)           */}
      {/* ========================================== */}
      {vipTables.length > 0 && (
        <section className="mb-12 bg-stone-900 p-6 md:p-8 rounded-[2rem] shadow-xl border border-stone-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl shadow-lg">
              <Crown className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">VIP / Couples Section</h2>
              <p className="text-stone-400 text-xs">Premium seating for special occasions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
            {vipTables.map(renderTableCard)}
          </div>
        </section>
      )}

      {/* ========================================== */}
      {/* REGULAR TABLES (Grouped by Capacity)       */}
      {/* ========================================== */}
      <div className="space-y-10">
        {sortedCapacities.map((capacity) => (
          <section key={capacity}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-gofoodie-orange rounded-full"></div>
              <h2 className="text-lg font-black text-stone-900 dark:text-white">
                {capacity === 1 ? '1 Seat (Counter)' : `${capacity} Seats`}
              </h2>
              <span className="text-xs font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                {groupedRegularTables[capacity].length} Tables
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {groupedRegularTables[capacity].map(renderTableCard)}
            </div>
          </section>
        ))}
      </div>

      {/* ADD TABLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl w-full max-w-md p-6 animate-slide-up border border-stone-200 dark:border-stone-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-stone-900 dark:text-white">Add New Table</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-stone-400 hover:text-red-500 bg-stone-100 dark:bg-stone-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-widest">Table Number / Name *</label>
                <input 
                  required type="text" value={newTableNumber} onChange={(e) => setNewTableNumber(e.target.value)} 
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm" 
                  placeholder="e.g. T27 or VIP-3" 
                />
                <p className="text-[10px] text-stone-400 mt-1">* If you type "VIP-3", it will automatically go to the VIP section above.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-widest">Capacity (Seats) *</label>
                <select 
                  value={newTableCapacity} onChange={(e) => setNewTableCapacity(e.target.value)} 
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Seat' : 'Seats'}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Add Table'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTablesPage;