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
import { useAuthStore } from '../store/authStore';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Room {
  id: string;
  name: string;
  color: string;
  post_count: number;
}

export default function CreatePostScreen() {
  const { user } = useAuthStore();
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

  useEffect(() => {
    loadRooms();
  }, []);

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
        if (data.length > 0) {
          setSelectedRoom(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
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

      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/api/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
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

  if (loadingRooms) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading rooms...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (rooms.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="grid-outline" size={64} color="#8E8E93" />
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
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePicker} onPress={showImagePicker}>
              <Ionicons name="camera-outline" size={32} color="#8E8E93" />
              <Text style={styles.imagePickerText}>Add Photo</Text>
            </TouchableOpacity>
          )}

          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="What are you recommending?"
            placeholderTextColor="#8E8E93"
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
            placeholderTextColor="#8E8E93"
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
                { borderColor: '#34C759' }
              ]}
              onPress={() => setRecommendationType('recommend')}
            >
              <Ionicons 
                name="thumbs-up" 
                size={20} 
                color={recommendationType === 'recommend' ? '#34C759' : '#8E8E93'} 
              />
              <Text style={[
                styles.toggleText,
                recommendationType === 'recommend' && { color: '#34C759' }
              ]}>
                Recommend
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                recommendationType === 'not_recommend' && styles.toggleButtonActive,
                { borderColor: '#FF3B30' }
              ]}
              onPress={() => setRecommendationType('not_recommend')}
            >
              <Ionicons 
                name="thumbs-down" 
                size={20} 
                color={recommendationType === 'not_recommend' ? '#FF3B30' : '#8E8E93'} 
              />
              <Text style={[
                styles.toggleText,
                recommendationType === 'not_recommend' && { color: '#FF3B30' }
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
                  color={actionType === action.key ? '#007AFF' : '#8E8E93'} 
                />
                <Text style={[
                  styles.actionText,
                  actionType === action.key && { color: '#007AFF' }
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
            placeholderTextColor="#8E8E93"
            value={tags}
            onChangeText={setTags}
          />

          {/* External Link */}
          <Text style={styles.label}>Link (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com"
            placeholderTextColor="#8E8E93"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createRoomButton: {
    backgroundColor: '#007AFF',
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
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
  },
  roomsContainer: {
    marginBottom: 8,
  },
  roomOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
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
    color: '#FFFFFF',
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
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingVertical: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2C2C2E',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 14,
    color: '#8E8E93',
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
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  toggleText: {
    fontSize: 16,
    color: '#8E8E93',
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
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  actionText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  postButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});