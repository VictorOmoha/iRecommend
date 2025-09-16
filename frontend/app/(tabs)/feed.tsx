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
import { mockPosts, mockCurrentUser } from '../../data/mockData';

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
  const [useMockData, setUseMockData] = useState(false);

useEffect(() => {
    // Always start with mock data for demo
    console.log('Loading feed... User:', user);
    
    // Force mock data to show immediately
    setUseMockData(true);
    setPosts(mockPosts);
    setLoading(false);
    
    // Still try to load real data if user exists
    if (user) {
      console.log('User exists, attempting to load real posts...');
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      setError(null);
      
      // Get the auth token
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        // Use mock data if no token
        setUseMockData(true);
        setPosts(mockPosts);
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
        if (data.length === 0) {
          // Use mock data if no posts
          setUseMockData(true);
          setPosts(mockPosts);
        } else {
          setPosts(data);
        }
      } else if (response.status === 401) {
        // Use mock data if auth fails
        setUseMockData(true);
        setPosts(mockPosts);
      } else {
        // Use mock data on error
        setUseMockData(true);
        setPosts(mockPosts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      // Use mock data on network error
      setUseMockData(true);
      setPosts(mockPosts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const renderPost = ({ item }: { item: Post }) => {
    return <PostCard post={item} onLike={(postId, liked) => {
      console.log(`Post ${postId} ${liked ? 'liked' : 'unliked'}`);
      // TODO: Update post like count in state
    }} />;
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading feed...</Text>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              setUseMockData(true);
              setPosts(mockPosts);
              setLoading(false);
            }}
          >
            <Text style={styles.skipButtonText}>Show Demo Content</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {useMockData && (
        <View style={styles.demoNotice}>
          <Ionicons name="information-circle-outline" size={16} color={theme.primary} />
          <Text style={styles.demoText}>Demo content shown</Text>
        </View>
      )}
      
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
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  demoText: {
    fontSize: 12,
    color: theme.primary,
    marginLeft: 6,
    fontWeight: '500',
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
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  listContainer: {
    paddingVertical: 8,
  },
});