import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Safely parse local storage to prevent crashes
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('gofoodie_user');
    if (stored && stored !== 'undefined') {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to parse user", error);
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem('gofoodie_token') || null,

  login: (user, token) => {
    localStorage.setItem('gofoodie_user', JSON.stringify(user));
    localStorage.setItem('gofoodie_token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('gofoodie_user');
    localStorage.removeItem('gofoodie_token');
    set({ user: null, token: null });
  },
}));