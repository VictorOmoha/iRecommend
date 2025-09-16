import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Room {
  id: string;
  name: string;
  color: string;
  post_count: number;
  created_at: string;
}

export default function RoomsScreen() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  const loadRooms = async () => {
    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/rooms/my`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRooms();
  };

  const renderRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity 
      style={[styles.roomCard, { borderLeftColor: item.color }]}
      onPress={() => router.push(`/room/${item.id}`)}
    >
      <View style={styles.roomHeader}>
        <View style={[styles.roomColorDot, { backgroundColor: item.color }]} />
        <Text style={styles.roomName}>{item.name}</Text>
      </View>
      
      <View style={styles.roomStats}>
        <Text style={styles.postCount}>
          {item.post_count} {item.post_count === 1 ? 'post' : 'posts'}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const styles = createStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading rooms...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Rooms</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/create-room')}
        >
          <Ionicons name="add" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {rooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="grid-outline" size={64} color={theme.textSecondary} />
          <Text style={styles.emptyTitle}>No rooms yet</Text>
          <Text style={styles.emptyDescription}>
            Create your first room to organize your recommendations by category.
          </Text>
          <TouchableOpacity 
            style={styles.emptyCreateButton}
            onPress={() => router.push('/create-room')}
          >
            <Text style={styles.emptyCreateButtonText}>Create Room</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  createButton: {
    padding: 8,
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
  emptyCreateButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyCreateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingVertical: 8,
  },
  roomCard: {
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    flex: 1,
  },
  roomStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postCount: {
    fontSize: 14,
    color: theme.textSecondary,
    marginRight: 8,
  },
});