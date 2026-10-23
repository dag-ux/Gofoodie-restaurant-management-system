import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore'; // 👈 Import Theme Store
import logoLight from '../../assets/logo-light.png'; // 👈 Import Logos
import logoDark from '../../assets/logo-dark.png';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { isDark } = useThemeStore(); // 👈 Get current theme

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/auth/login', formData);
      const loggedInUser = response.data.user;

      // STRICT CHECK: Only allow ADMIN roles here
      if (loggedInUser.role !== 'ADMIN') {
        setError('Access Denied. You do not have administrator privileges.');
        setIsLoading(false);
        return;
      }

      login(loggedInUser, response.data.token);
      navigate('/admin'); // Send directly to dashboard
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black transition-colors duration-300 overflow-hidden">
      
      <div className="relative bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-800 w-full max-w-md">
        
        <div className="text-center mb-6">
          {/* 👇 REPLACED ICON WITH DYNAMIC LOGO 👇 */}
          <div className="flex justify-center mb-4">
            <img 
              src={isDark ? logoDark : logoLight} 
              alt="GoofFoodie Logo" 
              className="h-16 md:h-20 w-auto object-contain drop-shadow-sm" 
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black mb-1 tracking-tight bg-gradient-to-r from-gofoodie-orange via-gofoodie-yellow to-gofoodie-orange bg-clip-text text-transparent">
            Welcome
          </h1>
          <h2 className="text-2xl sm:text-3xl font-black mb-1 tracking-tight bg-gradient-to-r from-gofoodie-orange via-gofoodie-yellow to-gofoodie-orange bg-clip-text text-transparent">
            GoFoodie Admin
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm font-medium mt-2">
            Authorized personnel access only.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-4 text-xs sm:text-sm font-bold text-center bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-stone-400" size={18} />
              <input 
                required 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm placeholder-stone-400 transition-all" 
                placeholder="admin@gofoodie.com" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-stone-400" size={18} />
              <input 
                required 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm placeholder-stone-400 transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? 'Verifying Access...' : <><ArrowRight size={18} /> Secure Login</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;