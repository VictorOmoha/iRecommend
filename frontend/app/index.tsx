import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function Index() {
  const { user, loading } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // If user is authenticated, redirect to main app
    if (user && !loading) {
      router.replace('/(tabs)/feed');
    }
  }, [user, loading]);

  const handleLogin = () => {
    console.log('Login button pressed');
    router.push('/(auth)/login');
  };

  const handleRegister = () => {
    console.log('Register button pressed');
    router.push('/(auth)/register');
  };

  const handleShowDemo = () => {
    console.log('Show demo pressed');
    router.push('/(tabs)/feed');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If user is already authenticated, this won't render due to the redirect above
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
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

          <TouchableOpacity 
            style={styles.demoButton} 
            onPress={handleShowDemo}
            activeOpacity={0.8}
          >
            <Text style={styles.demoButtonText}>View Demo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  authButtons: {
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#007AFF',
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
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
});