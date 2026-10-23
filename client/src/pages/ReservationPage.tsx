import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle2, Loader2, Phone, Mail, User, MessageSquare, AlertCircle } from 'lucide-react';
import { getAvailableTables, createReservation } from '../api/tableApi';

const ReservationPage = () => {
  const navigate = useNavigate();

  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    partySize: '2',
    tableId: '',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    specialRequests: '',
  });

  // Fetch all available tables on load
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await getAvailableTables();
        const available = data.filter((t: any) => t.status === 'FREE');
        setTables(available);
      } catch (error) {
        console.error("Failed to fetch tables", error);
        setErrorMsg("Could not connect to the restaurant server.");
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  // Smart Filtering: Whenever partySize changes, filter tables that are big enough
  const suitableTables = tables.filter(t => t.capacity >= Number(formData.partySize));
  const selectedTable = suitableTables.find(t => t.id.toString() === formData.tableId);

  // If the selected table becomes invalid (e.g. user changed party size to 8), reset tableId
  useEffect(() => {
    if (suitableTables.length > 0 && !selectedTable) {
      setFormData(prev => ({ ...prev, tableId: suitableTables[0].id.toString() }));
    } else if (suitableTables.length === 0) {
      setFormData(prev => ({ ...prev, tableId: '' }));
    }
  }, [formData.partySize, tables]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const dateTimeString = `${formData.date}T${formData.time}:00.000Z`;
      
      await createReservation({
        tableId: Number(formData.tableId),
        reservationTime: dateTimeString,
        partySize: Number(formData.partySize),
        guestName: formData.guestName,
        guestPhone: formData.guestPhone,
        guestEmail: formData.guestEmail,
        specialRequests: formData.specialRequests,
      });

      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || 'Failed to create reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black transition-colors duration-300">
        <div className="bg-white dark:bg-stone-900 p-6 md:p-10 rounded-[2rem] shadow-xl border border-stone-100 dark:border-stone-800 max-w-md w-full text-center">
          <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-black mb-3 bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow bg-clip-text text-transparent">
            Table Reserved!
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-8 leading-relaxed">
            Thank you, <span className="font-bold text-stone-800 dark:text-stone-200">{formData.guestName}</span>. We look forward to seeing you on <span className="font-bold text-stone-800 dark:text-stone-200">{formData.date}</span> at <span className="font-bold text-stone-800 dark:text-stone-200">{formData.time}</span>.
          </p>
          <button onClick={() => navigate('/')} className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-3 rounded-xl font-bold text-base hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black py-8 md:py-12 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        <div className="grid md:grid-cols-5 gap-0 bg-white dark:bg-stone-900 rounded-[2rem] shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
          
          {/* Left Column: Text & Info */}
          <div className="md:col-span-2 bg-stone-50 dark:bg-stone-800/50 p-6 md:p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gofoodie-orange/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gofoodie-yellow/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              {/* H1 ONLY GRADIENT, NO BLACK */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-[1.15] bg-gradient-to-r from-gofoodie-orange via-gofoodie-yellow to-gofoodie-orange bg-clip-text text-transparent">
                Join us at <br/>
                the table.
              </h1>
              
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-8">
                Reserve your table and arrive to a seat that's ready for you. Walk-ins are always welcome, but a reservation guarantees your spot.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300 font-bold bg-white dark:bg-stone-800 p-3 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                    <Phone size={18} className="text-gofoodie-orange" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-0.5">Call Us</p>
                    <p className="text-sm">+251 97 511 4444</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300 font-bold bg-white dark:bg-stone-800 p-3 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                    <Clock size={18} className="text-gofoodie-yellow" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-0.5">Opening Hours</p>
                    <p className="text-sm">7:00 AM - 11:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="md:col-span-3 p-6 md:p-8 lg:p-10">
            {loading ? (
              <div className="flex justify-center items-center h-full min-h-[350px]">
                <Loader2 className="animate-spin text-gofoodie-orange" size={40} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <h2 className="text-xl font-black text-stone-900 dark:text-white mb-6 border-b border-stone-100 dark:border-stone-800 pb-3">
                  Reservation Details
                </h2>

                {/* ERROR MESSAGE DISPLAY */}
                {errorMsg && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-xl flex items-center gap-3">
                    <AlertCircle className="text-red-500 shrink-0" size={18} />
                    <p className="text-red-700 dark:text-red-400 font-bold text-xs">{errorMsg}</p>
                  </div>
                )}

                {/* Guest Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><User size={12}/> Full Name *</label>
                    <input 
                      required 
                      type="text" 
                      pattern="^[a-zA-Z\s]+$"
                      title="Name should only contain letters"
                      value={formData.guestName} 
                      onChange={(e) => setFormData({...formData, guestName: e.target.value})} 
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Phone size={12}/> Phone Number *</label>
                    <input 
                      required 
                      type="tel" 
                      pattern="^(\+251|0)(9|7)[0-9]{8}$"
                      title="Please enter a valid Ethiopian phone number (e.g. 0911223344 or +251911223344)"
                      value={formData.guestPhone} 
                      onChange={(e) => setFormData({...formData, guestPhone: e.target.value})} 
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all" 
                      placeholder="0911223344" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Mail size={12}/> Email (Optional)</label>
                  <input 
                    type="email" 
                    value={formData.guestEmail} 
                    onChange={(e) => setFormData({...formData, guestEmail: e.target.value})} 
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all" 
                    placeholder="john@example.com" 
                  />
                </div>

                <div className="border-t border-stone-100 dark:border-stone-800 pt-4"></div>

                {/* Date, Time, Party Size */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12}/> Date *</label>
                    <input 
                      required 
                      type="date" 
                      value={formData.date} 
                      onChange={(e) => setFormData({...formData, date: e.target.value})} 
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> Time *</label>
                    <input 
                      required 
                      type="time" 
                      value={formData.time} 
                      onChange={(e) => setFormData({...formData, time: e.target.value})} 
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Users size={12}/> Party Size *</label>
                    <select 
                      value={formData.partySize} 
                      onChange={(e) => setFormData({...formData, partySize: e.target.value})} 
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Smart Table Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest">Select Available Table *</label>
                  {suitableTables.length === 0 ? (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-xs border border-red-100 dark:border-red-800">
                      No tables available for a party of {formData.partySize}. Please select a smaller size or call us.
                    </div>
                  ) : (
                    <select 
                      value={formData.tableId} 
                      onChange={(e) => setFormData({...formData, tableId: e.target.value})} 
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all cursor-pointer"
                    >
                      {suitableTables.map(t => (
                        <option key={t.id} value={t.id}>Table {t.tableNumber} (Seats {t.capacity})</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare size={12}/> Special Requests</label>
                  <textarea 
                    rows={2} 
                    value={formData.specialRequests} 
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})} 
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all resize-none" 
                    placeholder="Dietary needs, special occasion..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || suitableTables.length === 0} 
                  className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-3 rounded-xl font-black text-base hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : 'Confirm Reservation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;