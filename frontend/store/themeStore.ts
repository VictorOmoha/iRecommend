import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  text: string;
  textSecondary: string;
  primary: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export const lightTheme: Theme = {
  background: '#FFFFFF',
  surface: '#F2F2F7',
  surfaceSecondary: '#FFFFFF',
  border: '#C6C6C8',
  text: '#000000',
  textSecondary: '#6D6D70',
  primary: '#007AFF',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
};

export const darkTheme: Theme = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  border: '#38383A',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  primary: '#007AFF',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
};

interface ThemeState {
  isDarkMode: boolean;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: true, // Default to dark mode
  theme: darkTheme,
  
  toggleTheme: async () => {
    const { isDarkMode } = get();
    const newIsDarkMode = !isDarkMode;
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('theme_mode', newIsDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
    
    set({
      isDarkMode: newIsDarkMode,
      theme: newIsDarkMode ? darkTheme : lightTheme,
    });
  },
  
  setTheme: async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem('theme_mode', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
    
    set({
      isDarkMode: isDark,
      theme: isDark ? darkTheme : lightTheme,
    });
  },
  
  initializeTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_mode');
      const isDark = savedTheme === 'light' ? false : true; // Default to dark if no preference
      
      set({
        isDarkMode: isDark,
        theme: isDark ? darkTheme : lightTheme,
      });
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Keep default theme on error
    }
  },
}));