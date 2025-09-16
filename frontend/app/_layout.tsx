import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function RootLayout() {
  const { setUser, setLoading } = useAuthStore();
  const { initializeTheme, theme, isDarkMode } = useThemeStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Initialize theme first
    await initializeTheme();
    
    // Then check authentication
    await checkExistingSession();
  };

  const checkExistingSession = async () => {
    try {
      // Check if user has a stored token
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid, remove it
        await AsyncStorage.removeItem('access_token');
      }
    } catch (error) {
      console.log('No existing session found');
      await AsyncStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="create-room" options={{ 
          title: 'Create Room',
          presentation: 'modal',
          headerStyle: { backgroundColor: theme.surface }
        }} />
        <Stack.Screen name="create-post" options={{ 
          title: 'New Recommendation',
          presentation: 'modal',
          headerStyle: { backgroundColor: theme.surface }
        }} />
      </Stack>
    </>
  );
}