import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  external_link?: string;
  follower_count: number;
  following_count: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  
  setUser: (user) => set({ user }),
  
  setLoading: (loading) => set({ loading }),
  
  logout: async () => {
    try {
      // Clear local storage first
      await AsyncStorage.removeItem('access_token');
      
      // Clear user state
      set({ user: null });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if there's an error
      await AsyncStorage.removeItem('access_token');
      set({ user: null });
    }
  },
}));