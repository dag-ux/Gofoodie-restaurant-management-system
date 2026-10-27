import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Calendar, Clock, Users, CheckCircle, XCircle, Loader2, Phone, User } from 'lucide-react';

interface Reservation {
  id: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  specialRequests: string | null;
  reservationTime: string;
  partySize: number;
  status: string;
  table: {
    id: number;
    tableNumber: string;
    capacity: number;
  };
}

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchReservations = async () => {
    try {
      const response = await axiosClient.get('/tables/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch reservations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleCancel = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await axiosClient.delete(`/tables/reservations/${id}`);
      setToast({ type: 'success', message: 'Reservation cancelled. Table is now FREE.' });
      fetchReservations(); 
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to cancel reservation.' });
    }
  };

  const handleCheckIn = async (id: number) => {
    if (!window.confirm("Has the guest arrived? This will mark the table as OCCUPIED.")) return;
    try {
      await axiosClient.put(`/tables/reservations/${id}/checkin`);
      setToast({ type: 'success', message: 'Guest checked in. Table is now OCCUPIED.' });
      fetchReservations(); 
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to check in guest.' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin text-gofoodie-orange mb-4" size={40} />
        <p className="text-stone-500 font-bold animate-pulse">Loading Reservations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 relative">
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border animate-slide-in ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-1">
            Table <span className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow bg-clip-text text-transparent">Reservations</span>
          </h1>
          <p className="text-stone-500 text-sm">Manage guest bookings and arrivals.</p>
        </div>
      </div>

      <div className="space-y-3">
        {reservations.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <Calendar size={56} className="mx-auto text-stone-300 dark:text-stone-700 mb-4" />
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-1">No reservations found</h3>
            <p className="text-stone-500 text-sm">When customers book a table, it will appear here.</p>
          </div>
        ) : (
          reservations.map((res) => {
            const resDate = new Date(res.reservationTime);
            const isPast = resDate < new Date();
            const isCancelled = res.status === 'CANCELLED';
            const isCompleted = res.status === 'COMPLETED';

            return (
              <div key={res.id} className={`bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden transition-all duration-300 hover:shadow-md ${(isPast || isCancelled || isCompleted) ? 'opacity-60 grayscale' : ''}`}>
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-5 gap-6">
                  <div className="flex items-center gap-5 w-full lg:w-auto">
                    <div className="bg-orange-50 dark:bg-orange-900/20 text-gofoodie-orange p-4 rounded-xl text-center min-w-[80px] border border-orange-100 dark:border-orange-900/50">
                      <p className="text-xs font-bold uppercase tracking-wider">{resDate.toLocaleString('default', { month: 'short' })}</p>
                      <p className="text-2xl font-black">{resDate.getDate()}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 dark:text-white text-lg flex items-center gap-2">
                        Table {res.table.tableNumber} 
                        <span className="text-xs font-bold text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">Seats {res.table.capacity}</span>
                      </h3>
                      {/* 👇 FIXED TIME DISPLAY HERE 👇 */}
                      <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                        <Clock size={14} /> {resDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full lg:w-auto bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-stone-400" />
                      <div>
                        <p className="font-bold text-stone-900 dark:text-white text-sm">{res.guestName}</p>
                        <p className="text-xs text-stone-500 flex items-center gap-1"><Phone size={10} /> {res.guestPhone}</p>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-stone-200 dark:bg-stone-700"></div>
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-gofoodie-orange" />
                      <p className="font-bold text-stone-900 dark:text-white text-sm">{res.partySize} <span className="text-xs text-stone-500 font-normal">People</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                    {!isCancelled && !isPast && !isCompleted ? (
                      <>
                        <button 
                          onClick={() => handleCancel(res.id)} 
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors border border-red-100"
                        >
                          Cancel Booking
                        </button>
                        <button 
                          onClick={() => handleCheckIn(res.id)} 
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors shadow-sm"
                        >
                          Mark Arrived
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-2 rounded-lg text-xs font-bold ${
                        isCancelled ? 'bg-red-100 text-red-600' : 
                        isCompleted ? 'bg-blue-100 text-blue-600' : 
                        'bg-stone-100 text-stone-500'
                      }`}>
                        {isCancelled ? 'CANCELLED' : isCompleted ? 'SEATED / COMPLETED' : 'PAST'}
                      </span>
                    )}
                  </div>
                </div>

                {res.specialRequests && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 px-5 py-2 border-t border-yellow-100 dark:border-yellow-900/50 flex items-center gap-2">
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider">Note:</span>
                    <p className="text-xs text-yellow-800 dark:text-yellow-400">{res.specialRequests}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminReservationsPage;