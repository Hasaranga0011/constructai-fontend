import type { User, AuthResponse } from '../api/auth';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (response: AuthResponse) => void;
  setUser: (user: User) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

// Simple in-memory store
const store: AuthStore = {
  user: null,
  token: null,
  isAuthenticated: false,
  
  setAuth: (response: AuthResponse) => {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    store.user = response.user;
    store.token = response.access_token;
    store.isAuthenticated = true;
  },
  
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    store.user = user;
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    store.user = null;
    store.token = null;
    store.isAuthenticated = false;
  },
  
  loadFromStorage: () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      store.token = token;
      store.user = JSON.parse(user);
      store.isAuthenticated = true;
    }
  },
};

export const authStore = store;

export const useAuthStore = () => store;
