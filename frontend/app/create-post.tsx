import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { mockUserRooms } from '../data/mockData';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Room {
  id: string;
  name: string;
  color: string;
  post_count: number;
}

export default function CreatePostScreen() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [recommendationType, setRecommendationType] = useState<'recommend' | 'not_recommend'>('recommend');
  const [actionType, setActionType] = useState<'buy' | 'listen' | 'watch' | 'read'>('buy');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setUseMockData(true);
        setRooms(mockUserRooms);
        if (mockUserRooms.length > 0) {
          setSelectedRoom(mockUserRooms[0]);
        }
        setLoadingRooms(false);
        return;
      }

      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/rooms/my`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          setUseMockData(true);
          setRooms(mockUserRooms);
          if (mockUserRooms.length > 0) {
            setSelectedRoom(mockUserRooms[0]);
          }
        } else {
          setRooms(data);
          if (data.length > 0) {
            setSelectedRoom(data[0]);
          }
        }
      } else {
        setUseMockData(true);
        setRooms(mockUserRooms);
        if (mockUserRooms.length > 0) {
          setSelectedRoom(mockUserRooms[0]);
        }
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      setUseMockData(true);
      setRooms(mockUserRooms);
      if (mockUserRooms.length > 0) {
        setSelectedRoom(mockUserRooms[0]);
      }
    } finally {
      setLoadingRooms(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCreatePost = async () => {
    if (!selectedRoom) {
      Alert.alert('Error', 'Please select a room first');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    setCreating(true);
    
    try {
      if (useMockData) {
        // Simulate creating post with mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        Alert.alert('Success', 'Demo recommendation created successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        return;
      }

      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      const postData = {
        room_id: selectedRoom.id,
        title: title.trim(),
        description: description.trim(),
        media: selectedImage || '',
        media_type: 'image',
        tags: tagArray,
        external_link: externalLink.trim(),
        recommendation_type: recommendationType,
        action_type: actionType,
      };

      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Recommendation posted successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        const error = await response.json();
        Alert.alert('Error', error.detail || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const styles = createStyles(theme);

  if (loadingRooms) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading rooms...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (rooms.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="grid-outline" size={64} color={theme.textSecondary} />
          <Text style={styles.emptyTitle}>No rooms found</Text>
          <Text style={styles.emptyDescription}>
            You need to create a room first before posting recommendations.
          </Text>
          <TouchableOpacity 
            style={styles.createRoomButton}
            onPress={() => router.push('/create-room')}
          >
            <Text style={styles.createRoomButtonText}>Create Room</Text>
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
          <Text style={styles.demoText}>Demo mode - post won't be saved</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Room Selection */}
          <Text style={styles.label}>Select Room</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomsContainer}>
            {rooms.map((room) => (
              <TouchableOpacity
                key={room.id}
                style={[
                  styles.roomOption,
                  { borderColor: room.color },
                  selectedRoom?.id === room.id && { backgroundColor: `${room.color}20` }
                ]}
                onPress={() => setSelectedRoom(room)}
              >
                <View style={[styles.roomDot, { backgroundColor: room.color }]} />
                <Text style={styles.roomText}>{room.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Image Upload */}
          <Text style={styles.label}>Add Image (Optional)</Text>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={24} color={theme.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePicker} onPress={showImagePicker}>
              <Ionicons name="camera-outline" size={32} color={theme.textSecondary} />
              <Text style={styles.imagePickerText}>Add Photo</Text>
            </TouchableOpacity>
          )}

          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="What are you recommending?"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={80}
          />
          <Text style={styles.charCount}>{title.length}/80</Text>

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us more about it..."
            placeholderTextColor={theme.textSecondary}
            value={description}
            onChangeText={setDescription}
            maxLength={280}
            multiline
          />
          <Text style={styles.charCount}>{description.length}/280</Text>

          {/* Recommendation Type */}
          <Text style={styles.label}>Recommendation</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                recommendationType === 'recommend' && styles.toggleButtonActive,
                { borderColor: theme.success }
              ]}
              onPress={() => setRecommendationType('recommend')}
            >
              <Ionicons 
                name="thumbs-up" 
                size={20} 
                color={recommendationType === 'recommend' ? theme.success : theme.textSecondary} 
              />
              <Text style={[
                styles.toggleText,
                recommendationType === 'recommend' && { color: theme.success }
              ]}>
                Recommend
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                recommendationType === 'not_recommend' && styles.toggleButtonActive,
                { borderColor: theme.error }
              ]}
              onPress={() => setRecommendationType('not_recommend')}
            >
              <Ionicons 
                name="thumbs-down" 
                size={20} 
                color={recommendationType === 'not_recommend' ? theme.error : theme.textSecondary} 
              />
              <Text style={[
                styles.toggleText,
                recommendationType === 'not_recommend' && { color: theme.error }
              ]}>
                Don't Recommend
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Type */}
          <Text style={styles.label}>Action</Text>
          <View style={styles.actionGrid}>
            {[
              { key: 'buy', icon: 'bag-outline', label: 'Buy' },
              { key: 'listen', icon: 'musical-notes-outline', label: 'Listen' },
              { key: 'watch', icon: 'play-outline', label: 'Watch' },
              { key: 'read', icon: 'book-outline', label: 'Read' },
            ].map((action) => (
              <TouchableOpacity
                key={action.key}
                style={[
                  styles.actionButton,
                  actionType === action.key && styles.actionButtonActive
                ]}
                onPress={() => setActionType(action.key as any)}
              >
                <Ionicons 
                  name={action.icon as any} 
                  size={20} 
                  color={actionType === action.key ? theme.primary : theme.textSecondary} 
                />
                <Text style={[
                  styles.actionText,
                  actionType === action.key && { color: theme.primary }
                ]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tags */}
          <Text style={styles.label}>Tags (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="food, restaurant, italian (comma separated)"
            placeholderTextColor={theme.textSecondary}
            value={tags}
            onChangeText={setTags}
          />

          {/* External Link */}
          <Text style={styles.label}>Link (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com"
            placeholderTextColor={theme.textSecondary}
            value={externalLink}
            onChangeText={setExternalLink}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.postButton,
            (!title.trim() || !description.trim() || !selectedRoom || creating) && styles.postButtonDisabled
          ]}
          onPress={handleCreatePost}
          disabled={!title.trim() || !description.trim() || !selectedRoom || creating}
        >
          {creating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.postButtonText}>Post Recommendation</Text>
          )}
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
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
  createRoomButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createRoomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
    marginTop: 16,
  },
  roomsContainer: {
    marginBottom: 8,
  },
  roomOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roomDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  roomText: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
  },
  imagePicker: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingVertical: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.border,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 8,
  },
  input: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.text,
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'right',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  toggleButtonActive: {
    backgroundColor: theme.primary + '20',
  },
  toggleText: {
    fontSize: 16,
    color: theme.textSecondary,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonActive: {
    backgroundColor: theme.primary + '20',
  },
  actionText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  postButton: {
    flex: 2,
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: theme.surfaceSecondary,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});