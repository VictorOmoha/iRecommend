import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [loading, setLoading] = useState(true);
  const [sessionProcessing, setSessionProcessing] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Handle deep linking from auth
  useEffect(() => {
    const handleUrl = (url: string) => {
      const parsedUrl = Linking.parse(url);
      const fragment = parsedUrl.fragment;
      
      if (fragment && fragment.includes('session_id=')) {
        const sessionId = fragment.split('session_id=')[1];
        if (sessionId) {
          processSession(sessionId);
        }
      }
    };

    // Check for URL on app start
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      }
    });

    // Listen for URL changes
    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    return () => subscription.remove();
  }, []);

  const checkExistingSession = async () => {
    try {
      // Check if user is already authenticated
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

  const processSession = async (sessionId: string) => {
    setSessionProcessing(true);
    
    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/auth/process-session`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Store session token locally as backup
        await AsyncStorage.setItem('session_token', data.session_token);
        
        // Clean up URL by removing fragment
        // This is a simplified cleanup - in a real app you'd handle this better
        Alert.alert('Welcome!', `Hello ${data.user.name}! You're now logged in.`);
      } else {
        const error = await response.json();
        Alert.alert('Authentication Error', error.detail || 'Failed to authenticate');
      }
    } catch (error) {
      console.error('Session processing error:', error);
      Alert.alert('Error', 'Failed to process authentication');
    } finally {
      setSessionProcessing(false);
    }
  };

  const handleLogin = () => {
    const redirectUrl = Linking.createURL('/');
    const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    Linking.openURL(authUrl);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear local storage
      await AsyncStorage.removeItem('session_token');
      setUser(null);
      
      Alert.alert('Logged out', 'You have been logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (loading || sessionProcessing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            {sessionProcessing ? 'Authenticating...' : 'Loading...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.appTitle}>i-Recommend</Text>
        <Text style={styles.appSubtitle}>Share & Discover Recommendations</Text>
      </View>

      <View style={styles.content}>
        {user ? (
          // Authenticated user content
          <View style={styles.userContainer}>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userHandle}>@{user.username}</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{user.follower_count}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{user.following_count}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>

            <View style={styles.navigationHint}>
              <Text style={styles.hintText}>🚧 More features coming soon!</Text>
              <Text style={styles.hintSubtext}>
                We're building rooms, posts, feed, and messaging features.
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.button, styles.logoutButton]} 
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Guest user content
          <View style={styles.guestContainer}>
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

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>
            
            <Text style={styles.disclaimer}>
              Secure authentication powered by Emergent
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeSection: {
    marginBottom: 48,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featureList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 24,
  },
  userContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 48,
  },
  welcomeText: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 8,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 48,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  navigationHint: {
    backgroundColor: '#1C1C1E',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  hintText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  hintSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});