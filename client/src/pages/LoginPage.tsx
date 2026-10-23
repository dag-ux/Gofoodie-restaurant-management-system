import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

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
        login(loggedInUser, response.data.token);
        
        // 👇 THE MAGIC REDIRECT 👇
        if (loggedInUser.role === 'ADMIN') {
          navigate('/admin'); 
        } else {
          navigate('/'); 
        }
      } else {
        await axiosClient.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'CUSTOMER',
        });
        setIsLoginView(true);
        setError('Account created! Please log in.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-stone-50 dark:bg-stone-950">
      <div className="bg-white dark:bg-stone-900 p-8 md:p-10 rounded-3xl shadow-xl border border-stone-100 dark:border-stone-800 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white mb-2">
            {isLoginView ? 'Welcome Back' : 'Create an Account'}
          </h1>
        </div>

        {error && <div className="p-3 rounded-xl mb-6 text-sm font-bold text-center bg-red-50 text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLoginView && (
            <div>
              <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-stone-400" size={20} />
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 dark:text-white" placeholder="Abebe Bikila" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-stone-400" size={20} />
              <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 dark:text-white" placeholder="admin@gofoodie.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-stone-400" size={20} />
              <input required type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 dark:text-white" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-gofoodie-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 mt-4">
            {isLoading ? 'Please wait...' : isLoginView ? 'Log In' : 'Sign Up'}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-gofoodie-orange font-bold hover:underline">
            {isLoginView ? 'Need an account? Register' : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;