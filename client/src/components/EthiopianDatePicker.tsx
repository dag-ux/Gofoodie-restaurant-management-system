import { useState, useEffect } from 'react';
import ethiopianDate from 'ethiopian-date';

const ETHIOPIAN_MONTHS = [
  'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት', 
  'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
];

const TIME_OPTIONS = [
  { label: '12:00 ንጋት (6:00 AM)', value: 6 },
  { label: '1:00 ጠዋት (7:00 AM)', value: 7 }, 
  { label: '2:00 ጠዋት (8:00 AM)', value: 8 }, 
  { label: '3:00 ጠዋት (9:00 AM)', value: 9 }, 
  { label: '4:00 ጠዋት (10:00 AM)', value: 10 }, 
  { label: '5:00 ጠዋት (11:00 AM)', value: 11 },
  { label: '6:00 ቀን (12:00 PM)', value: 12 }, 
  { label: '7:00 ቀን (1:00 PM)', value: 13 }, 
  { label: '8:00 ቀን (2:00 PM)', value: 14 }, 
  { label: '9:00 ቀን (3:00 PM)', value: 15 }, 
  { label: '10:00 ቀን (4:00 PM)', value: 16 }, 
  { label: '11:00 ቀን (5:00 PM)', value: 17 },
  { label: '12:00 ማታ (6:00 PM)', value: 18 }, 
  { label: '1:00 ማታ (7:00 PM)', value: 19 }, 
  { label: '2:00 ማታ (8:00 PM)', value: 20 }, 
  { label: '3:00 ማታ (9:00 PM)', value: 21 }, 
  { label: '4:00 ማታ (10:00 PM)', value: 22 }
];

interface Props {
  onDateChange: (isoDate: string) => void;
}

const EthiopianDatePicker = ({ onDateChange }: Props) => {
  const today = new Date();
  const [currentEthYear, currentEthMonth, currentEthDay] = ethiopianDate.toEthiopian(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const [ethYear, setEthYear] = useState(currentEthYear);
  const [ethMonth, setEthMonth] = useState(currentEthMonth);
  const [ethDay, setEthDay] = useState(currentEthDay);
  const [selectedTime, setSelectedTime] = useState(18);

  const getDaysInMonth = (month: number, year: number) => {
    if (month === 13) return (year % 4 === 3) ? 6 : 5; 
    return 30;
  };

  const daysInMonth = getDaysInMonth(ethMonth, ethYear);

  useEffect(() => {
    const [gregYear, gregMonth, gregDay] = ethiopianDate.toGregorian(ethYear, ethMonth, Math.min(ethDay, daysInMonth));

    const mm = String(gregMonth).padStart(2, '0');
    const dd = String(gregDay).padStart(2, '0');
    const hh = String(selectedTime).padStart(2, '0');
    
    onDateChange(`${gregYear}-${mm}-${dd}T${hh}:00:00.000Z`);
  }, [ethYear, ethMonth, ethDay, selectedTime]);

  const years = [currentEthYear - 1, currentEthYear, currentEthYear + 1, currentEthYear + 2];

  return (
    <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase">ቀን (Day)</label>
          <select value={ethDay} onChange={(e) => setEthDay(Number(e.target.value))} className="w-full px-2 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase">ወር (Month)</label>
          <select value={ethMonth} onChange={(e) => setEthMonth(Number(e.target.value))} className="w-full px-2 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm">
            {ETHIOPIAN_MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase">ዓመት (Year)</label>
          <select value={ethYear} onChange={(e) => setEthYear(Number(e.target.value))} className="w-full px-2 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
        <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase">ሰዓት (Time)</label>
        <select value={selectedTime} onChange={(e) => setSelectedTime(Number(e.target.value))} className="w-full px-2 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm">
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EthiopianDatePicker;