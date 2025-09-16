import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';

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

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, liked: boolean) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const { theme } = useThemeStore();
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liking) return;
    
    setLiking(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newLikedState = !liked;
      setLiked(newLikedState);
      onLike?.(post.id, newLikedState);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleExternalLink = () => {
    if (post.external_link) {
      Alert.alert(
        'Open Link',
        `Open ${post.external_link}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open', onPress: () => Linking.openURL(post.external_link!) }
        ]
      );
    }
  };

  const handleComment = () => {
    Alert.alert('Comments', 'Comment feature coming soon!');
  };

  const handleRepost = () => {
    Alert.alert('Repost', 'Repost feature coming soon!');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share feature coming soon!');
  };

  const getActionIcon = () => {
    switch (post.action_type) {
      case 'buy': return 'bag-outline';
      case 'listen': return 'musical-notes-outline';
      case 'watch': return 'play-outline';
      case 'read': return 'book-outline';
      default: return 'star-outline';
    }
  };

  const getRecommendationColor = () => {
    return post.recommendation_type === 'recommend' ? theme.success : theme.error;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {post.user.avatar ? (
            <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={20} color={theme.textSecondary} />
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{post.user.name}</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.username}>@{post.user.username}</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.timestamp}>{formatDate(post.created_at)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.roomBadge}>
          <View style={[styles.roomDot, { backgroundColor: post.room.color }]} />
          <Text style={styles.roomName}>{post.room.name}</Text>
        </View>
      </View>

      {/* Media */}
      {post.media && (
        <View style={styles.mediaContainer}>
          <Image 
            source={{ uri: post.media }} 
            style={styles.media}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={[styles.recommendationBadge, { backgroundColor: getRecommendationColor() + '20' }]}>
            <Ionicons 
              name={post.recommendation_type === 'recommend' ? 'thumbs-up' : 'thumbs-down'} 
              size={16} 
              color={getRecommendationColor()} 
            />
            <Text style={[styles.recommendationText, { color: getRecommendationColor() }]}>
              {post.recommendation_type === 'recommend' ? 'Recommend' : 'Don\'t Recommend'}
            </Text>
          </View>
          
          <View style={styles.actionBadge}>
            <Ionicons name={getActionIcon()} size={16} color={theme.primary} />
            <Text style={styles.actionText}>{post.action_type}</Text>
          </View>
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>

        {/* Tags */}
        {post.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {post.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* External Link */}
        {post.external_link && (
          <TouchableOpacity style={styles.linkButton} onPress={handleExternalLink}>
            <Ionicons name="link-outline" size={16} color={theme.primary} />
            <Text style={styles.linkText}>View Link</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleLike}
          disabled={liking}
        >
          <Ionicons 
            name={liked ? 'heart' : 'heart-outline'} 
            size={20} 
            color={liked ? theme.error : theme.textSecondary} 
          />
          <Text style={[styles.actionCount, liked && { color: theme.error }]}>
            {post.like_count + (liked ? 1 : 0)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.textSecondary} />
          <Text style={styles.actionCount}>{post.comment_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleRepost}>
          <Ionicons name="repeat-outline" size={20} color={theme.textSecondary} />
          <Text style={styles.actionCount}>{post.repost_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: theme.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  username: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  separator: {
    fontSize: 14,
    color: theme.textSecondary,
    marginHorizontal: 6,
  },
  timestamp: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  roomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roomDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  roomName: {
    fontSize: 12,
    color: theme.text,
    fontWeight: '500',
  },
  mediaContainer: {
    aspectRatio: 16 / 9,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: theme.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: '500',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '500',
    marginLeft: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionCount: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
});