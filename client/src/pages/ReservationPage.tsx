import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle2, Loader2, Phone, Mail, User, MessageSquare, AlertCircle, Calendar, Clock, Printer } from 'lucide-react';
import { getAvailableTables, createReservation } from '../api/tableApi';
import EthiopianDatePicker from '../components/EthiopianDatePicker';
import ethiopianDate from 'ethiopian-date'; 

const ReservationPage = () => {
  const navigate = useNavigate();

  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    reservationTime: '',
    partySize: '2',
    tableId: '',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    specialRequests: '',
  });

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

  const suitableTables = tables.filter(t => t.capacity >= Number(formData.partySize));
  const selectedTable = suitableTables.find(t => t.id.toString() === formData.tableId);

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
      await createReservation({
        tableId: Number(formData.tableId),
        reservationTime: formData.reservationTime, 
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

  const getTicketDetails = () => {
    if (!formData.reservationTime) return null;
    
    const isoDate = formData.reservationTime;
    const dateObj = new Date(isoDate);
    
    const gYear = dateObj.getUTCFullYear();
    const gMonth = dateObj.getUTCMonth() + 1;
    const gDay = dateObj.getUTCDate();
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();

    const [eYear, eMonth, eDay] = ethiopianDate.toEthiopian(gYear, gMonth, gDay);
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const gregTime = `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    let ethTimeLabel = '';
    if (hours === 6) ethTimeLabel = '12:00 ንጋት';
    else if (hours >= 7 && hours <= 11) ethTimeLabel = `${hours - 6}:00 ጠዋት`;
    else if (hours >= 12 && hours <= 17) ethTimeLabel = `${hours - 6}:00 ቀን`;
    else if (hours >= 18 && hours <= 22) ethTimeLabel = `${hours - 18 === 0 ? 12 : hours - 18}:00 ማታ`;

    const tableInfo = tables.find(t => t.id.toString() === formData.tableId);

    return {
      name: formData.guestName,
      phone: formData.guestPhone,
      tableNumber: tableInfo?.tableNumber || 'N/A',
      partySize: formData.partySize,
      gDate: `${gDay}/${gMonth}/${gYear}`,
      eDate: `${eDay} / ${eMonth} / ${eYear}`,
      gregTime,
      ethTime: ethTimeLabel
    };
  };

  const ticket = getTicketDetails();

  if (isSuccess && ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black transition-colors duration-300">
        <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-[2rem] shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden relative">
          <div className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow p-6 text-center text-white relative">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-wide">Reservation Confirmed</h1>
            <p className="text-white/80 text-sm mt-1">Please show this ticket at the reception</p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-dashed border-stone-200 dark:border-stone-700">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Guest Name</p>
                <p className="font-black text-lg text-stone-900 dark:text-white">{ticket.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Party Size</p>
                <p className="font-black text-lg text-stone-900 dark:text-white">{ticket.partySize} People</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-dashed border-stone-200 dark:border-stone-700">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={12}/> Date</p>
                <p className="font-bold text-sm text-stone-900 dark:text-white">{ticket.eDate} <span className="text-stone-400">(E.C)</span></p>
                <p className="text-xs text-stone-500">{ticket.gDate}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={12}/> Time</p>
                <p className="font-bold text-sm text-stone-900 dark:text-white">{ticket.ethTime}</p>
                <p className="text-xs text-stone-500">{ticket.gregTime}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pb-4">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Assigned Table</p>
                <p className="font-black text-2xl text-gofoodie-orange">{ticket.tableNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Contact</p>
                <p className="font-bold text-sm text-stone-900 dark:text-white">{ticket.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 p-6 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md">
              <Printer size={18} /> Print / Save Ticket
            </button>
            <button onClick={() => navigate('/')} className="w-full bg-transparent text-stone-500 py-2 rounded-xl font-bold text-sm hover:text-gofoodie-orange transition-all">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black py-8 md:py-12 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-0 bg-white dark:bg-stone-900 rounded-[2rem] shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
          
          <div className="md:col-span-2 bg-stone-50 dark:bg-stone-800/50 p-6 md:p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gofoodie-orange/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gofoodie-yellow/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
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
              </div>
            </div>
          </div>

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

                {errorMsg && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-xl flex items-center gap-3">
                    <AlertCircle className="text-red-500 shrink-0" size={18} />
                    <p className="text-red-700 dark:text-red-400 font-bold text-xs">{errorMsg}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><User size={12}/> Full Name *</label>
                    <input required type="text" pattern="^[a-zA-Z\s]+$" title="Name should only contain letters" value={formData.guestName} onChange={(e) => setFormData({...formData, guestName: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Phone size={12}/> Phone Number *</label>
                    <input required type="tel" pattern="^(\+251|0)(9|7)[0-9]{8}$" title="Please enter a valid Ethiopian phone number (e.g. 0911223344 or +251911223344)" value={formData.guestPhone} onChange={(e) => setFormData({...formData, guestPhone: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all" placeholder="0911223344" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Mail size={12}/> Email (Optional)</label>
                  <input type="email" value={formData.guestEmail} onChange={(e) => setFormData({...formData, guestEmail: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all" placeholder="john@example.com" />
                </div>

                <div className="border-t border-stone-100 dark:border-stone-800 pt-4"></div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-widest">
                      የቀጠሮ ቀን እና ሰዓት (Date & Time) *
                    </label>
                    <EthiopianDatePicker onDateChange={(isoDate) => setFormData({ ...formData, reservationTime: isoDate })} />
                    <p className="text-xs text-stone-400 mt-2">
                      * ሬስቶራንቱ ከ 12:00 ንጋት (6:00 AM) እስከ 4:00 ማታ (10:00 PM) ብቻ ይከፈታል። <br/>
                      * We only accept reservations between 6:00 AM and 10:00 PM.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                      <Users size={12}/> የሰዎች ብዛት (Party Size) *
                    </label>
                    <select value={formData.partySize} onChange={(e) => setFormData({...formData, partySize: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all cursor-pointer">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(num => (
                        <option key={num} value={num}>{num} ሰዎች</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest">Select Available Table *</label>
                  {suitableTables.length === 0 ? (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-xs border border-red-100 dark:border-red-800">
                      No tables available for a party of {formData.partySize}. Please select a smaller size or call us.
                    </div>
                  ) : (
                    <select value={formData.tableId} onChange={(e) => setFormData({...formData, tableId: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all cursor-pointer">
                      {suitableTables.map(t => (
                        <option key={t.id} value={t.id}>Table {t.tableNumber} (Seats {t.capacity})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare size={12}/> Special Requests</label>
                  <textarea rows={2} value={formData.specialRequests} onChange={(e) => setFormData({...formData, specialRequests: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white text-sm transition-all resize-none" placeholder="Dietary needs, special occasion..."></textarea>
                </div>

                <button type="submit" disabled={isSubmitting || suitableTables.length === 0} className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-3 rounded-xl font-black text-base hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0">
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