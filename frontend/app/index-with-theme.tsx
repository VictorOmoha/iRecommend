import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStore } from '../store/themeStore';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

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

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to show content immediately
  const { theme, isDarkMode, initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize theme
      await initializeTheme();
      
      // Quick check for existing session
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        // If we have a token, redirect to main app immediately
        router.replace('/(tabs)/feed');
      }
    } catch (error) {
      console.log('App initialization error:', error);
    }
  };

  const handleLogin = () => {
    console.log('Navigating to login...');
    router.push('/login');
  };

  const handleRegister = () => {
    console.log('Navigating to register...');
    router.push('/register');
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <View style={styles.header}>
        <Text style={styles.appTitle}>i-Recommend</Text>
        <Text style={styles.appSubtitle}>Share & Discover Recommendations</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to i-Recommend</Text>
          <Text style={styles.welcomeDescription}>
            The social platform where you can share and discover amazing recommendations from friends and influencers.
          </Text>
          
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>📱 Create recommendation rooms by category</Text>
            <Text style={styles.featureItem}>📸 Share photos and reviews</Text>
            <Text style={styles.featureItem}>👥 Follow friends and discover new content</Text>
            <Text style={styles.featureItem}>💬 Direct messaging and real-time updates</Text>
            <Text style={styles.featureItem}>🔥 Trending recommendations</Text>
          </View>
        </View>

        <View style={styles.authButtons}>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.text,
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  welcomeSection: {
    marginBottom: 48,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featureList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 12,
    lineHeight: 24,
  },
  authButtons: {
    gap: 16,
  },
  loginButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.primary,
    alignItems: 'center',
  },
  registerButtonText: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});