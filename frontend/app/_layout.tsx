import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function RootLayout() {
  const { setUser, setLoading } = useAuthStore();
  const { initializeTheme, theme, isDarkMode } = useThemeStore();

  useEffect(() => {
    initializeTheme();
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.log('No existing session found');
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