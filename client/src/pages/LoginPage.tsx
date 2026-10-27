import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Wand2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import logoLight from '../assets/logo-light.png';
import logoDark from '../assets/logo-dark.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { isDark } = useThemeStore();

  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pass });
    setShowPassword(true); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLoginView) {
        const response = await axiosClient.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        
        const loggedInUser = response.data.user;

        // 🚨 PREVENT ADMINS FROM LOGGING IN HERE
        if (loggedInUser.role === 'ADMIN') {
          setError('Administrators must use the Staff Portal to log in.');
          setIsLoading(false);
          return;
        }

        login(loggedInUser, response.data.token);
        navigate('/'); 
      } else {
        await axiosClient.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'CUSTOMER',
        });
        setIsLoginView(true);
        setError('Account created successfully! Please log in.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-black transition-colors duration-300 overflow-hidden">
      
      {/* 👇 CHANGED: Card background is now pure black in dark mode 👇 */}
      <div className="bg-white dark:bg-black p-6 sm:p-8 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-800 w-full max-w-sm">
        
        <div className="text-center mb-5">
          {/* Dynamic Logo */}
          <div className="flex justify-center mb-3">
            <img 
              src={isDark ? logoDark : logoLight} 
              alt="GoofFoodie Logo" 
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm" 
            />
          </div>

          <h1 className="text-2xl font-black mb-1 tracking-tight bg-gradient-to-r from-gofoodie-orange via-gofoodie-yellow to-gofoodie-orange bg-clip-text text-transparent">
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs font-medium">
            {isLoginView ? 'Log in to manage your orders.' : 'Join GoofFoodie today.'}
          </p>
        </div>

        {/* Enhanced Error Handling */}
        {error && (
          <div className={`p-3 rounded-xl mb-4 flex items-center gap-2 text-xs font-bold animate-fade-in ${
            error.includes('created') 
              ? 'text-green-600 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
              : 'text-red-600 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
          }`}>
            <AlertCircle size={16} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field (Only for Registration) */}
          {!isLoginView && (
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 text-stone-400" size={18} />
                <input 
                  required 
                  type="text" 
                  pattern="^[a-zA-Z\s]+$" 
                  title="Name should only contain letters" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-sm placeholder-stone-400 transition-all" 
                  placeholder="Abebe Bikila" 
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 text-stone-400" size={18} />
              <input 
                required 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-sm placeholder-stone-400 transition-all" 
                placeholder="you@example.com" 
              />
            </div>
          </div>

          {/* Password Field with Toggle & Suggest */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">Password</label>
              
              {!isLoginView && (
                <button 
                  type="button" 
                  onClick={generatePassword}
                  className="flex items-center gap-1 text-[10px] font-bold text-gofoodie-orange hover:text-orange-600 transition-colors bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md"
                >
                  <Wand2 size={12} /> Suggest
                </button>
              )}
            </div>
            
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
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-stone-400 hover:text-gofoodie-orange transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? 'Please wait...' : isLoginView ? 'Log In' : 'Sign Up'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Toggle View Button */}
        <div className="mt-5 text-center border-t border-stone-100 dark:border-stone-800 pt-4">
          <button 
            onClick={() => { setIsLoginView(!isLoginView); setError(''); }} 
            className="text-xs font-bold text-stone-500 hover:text-gofoodie-orange transition-colors"
          >
            {isLoginView ? 'Need an account? Register here' : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;