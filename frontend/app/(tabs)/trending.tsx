import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import PostCard from '../../components/PostCard';
import { mockTrendingPosts } from '../../data/mockData';

interface TrendingPost {
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
  trending_score: number;
  trending_reason: string;
}

export default function TrendingScreen() {
  const { theme } = useThemeStore();
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrendingPosts();
  }, []);

  const loadTrendingPosts = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTrendingPosts(mockTrendingPosts);
    } catch (error) {
      console.error('Error loading trending posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTrendingPosts();
  };

  const renderTrendingPost = ({ item, index }: { item: TrendingPost; index: number }) => (
    <View style={styles.trendingItem}>
      <View style={styles.trendingHeader}>
        <View style={styles.trendingRank}>
          <Text style={styles.rankNumber}>#{index + 1}</Text>
          <View style={styles.trendingBadge}>
            <Ionicons name="trending-up" size={12} color={theme.success} />
            <Text style={styles.trendingScore}>{item.trending_score}</Text>
          </View>
        </View>
        <Text style={styles.trendingReason}>{item.trending_reason}</Text>
      </View>
      <PostCard 
        post={item} 
        onLike={(postId, liked) => {
          setTrendingPosts(prev => prev.map(p => 
            p.id === postId 
              ? { ...p, like_count: liked ? p.like_count + 1 : p.like_count - 1 }
              : p
          ));
        }}
      />
    </View>
  );

  const styles = createStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="flame" size={64} color={theme.primary} />
          <Text style={styles.loadingText}>Loading trending posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="flame" size={24} color={theme.warning} />
          <Text style={styles.title}>Trending Now</Text>
        </View>
        <Text style={styles.subtitle}>Most popular recommendations this week</Text>
      </View>

      {trendingPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="flame-outline" size={64} color={theme.textSecondary} />
          <Text style={styles.emptyTitle}>No trending posts yet</Text>
          <Text style={styles.emptyDescription}>
            Check back later for the most popular recommendations.
          </Text>
        </View>
      ) : (
        <FlatList
          data={trendingPosts}
          renderItem={renderTrendingPost}
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
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
  },
  listContainer: {
    paddingVertical: 8,
  },
  trendingItem: {
    marginBottom: 16,
  },
  trendingHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingRank: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
    marginRight: 8,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingScore: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.success,
    marginLeft: 4,
  },
  trendingReason: {
    fontSize: 12,
    color: theme.textSecondary,
    fontStyle: 'italic',
  },
});