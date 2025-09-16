import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
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

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/posts?limit=20`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
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
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No posts yet</Text>
          <Text style={styles.emptyDescription}>
            Follow some users or create your first recommendation to see posts here.
          </Text>
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
  },
  loadingText: {
    color: theme.text,
    fontSize: 16,
    marginTop: 16,
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
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  listContainer: {
    paddingVertical: 8,
  },
});