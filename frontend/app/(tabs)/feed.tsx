import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import PostCard from '../../components/PostCard';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Post {
  id: string;
  title: string;
  description: string;
  media?: string;
  media_type?: string;
  tags: string[];
  external_link?: string;
  recommendation_type: 'recommend' | 'not_recommend';
  action_type: 'buy' | 'listen' | 'watch' | 'read';
  like_count: number;
  comment_count: number;
  repost_count: number;
  created_at: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  room: {
    id: string;
    name: string;
    color: string;
  };
}

export default function FeedScreen() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPosts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      setError(null);
      
      // Get the auth token
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/posts?limit=20`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else if (response.status === 401) {
        setError('Authentication failed. Please login again.');
        // Clear invalid token
        await AsyncStorage.removeItem('access_token');
        router.replace('/');
      } else {
        setError('Failed to load posts');
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard 
      post={item} 
      onLike={(postId, liked) => {
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, like_count: liked ? p.like_count + 1 : p.like_count - 1 }
            : p
        ));
      }}
    />
  );

  const styles = createStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading feed...</Text>
          
          {/* Add a timeout button */}
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => setLoading(false)}
          >
            <Text style={styles.skipButtonText}>Skip Loading</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.error} />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              loadPosts();
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="newspaper-outline" size={64} color={theme.textSecondary} />
          <Text style={styles.emptyTitle}>No posts yet</Text>
          <Text style={styles.emptyDescription}>
            Follow some users or create your first recommendation to see posts here.
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/create-post')}
          >
            <Text style={styles.createButtonText}>Create Your First Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    paddingHorizontal: 32,
  },
  loadingText: {
    color: theme.text,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  skipButton: {
    backgroundColor: theme.surfaceSecondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  skipButtonText: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingVertical: 8,
  },
});