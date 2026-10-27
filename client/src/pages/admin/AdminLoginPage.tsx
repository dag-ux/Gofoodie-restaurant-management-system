import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { isDark } = useThemeStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  
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
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Outer container ensures everything stays in view
    <div className="h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black transition-colors duration-300 overflow-hidden">
      
      {/* Compact Card - Now with pure black background in dark mode */}
      <div className="relative bg-white dark:bg-black p-6 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-800 w-full max-w-sm">
        
        <div className="text-center mb-4">
          {/* Logo */}
          <div className="flex justify-center mb-1">
            <img 
              src={isDark ? logoDark : logoLight} 
              alt="GoofFoodie Logo" 
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm" 
            />
          </div>
          {/* Welcome Text */}
          <h1 className="text-2xl font-black mb-1 tracking-tight bg-gradient-to-r from-gofoodie-orange via-gofoodie-yellow to-gofoodie-orange bg-clip-text text-transparent">
            WELCOME 
            TO
          </h1>
          <h1 className="text-2xl font-black mb-1 tracking-tight bg-gradient-to-r from-gofoodie-orange via-gofoodie-yellow to-gofoodie-orange bg-clip-text text-transparent">
             ADMIN
          </h1> 
        </div>

        {/* Enhanced Error Handling */}
        {error && (
          <div className="p-3 rounded-xl mb-4 flex items-center gap-2 text-xs font-bold text-red-600 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 text-stone-400" size={18} />
              <input 
                required 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-sm placeholder-stone-400 transition-all" 
                placeholder="admin@gofoodie.com" 
              />
            </div>
          </div>
          
          {/* Password Field with Toggle */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 text-stone-400" size={18} />
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-sm placeholder-stone-400 transition-all" 
                placeholder="••••••••" 
              />
              {/* Toggle Button */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-stone-400 hover:text-gofoodie-orange transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? 'Verifying Access...' : <><ArrowRight size={18} /> Secure Login</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;