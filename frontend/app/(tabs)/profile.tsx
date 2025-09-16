import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { mockCurrentUser } from '../../data/mockData';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { theme, isDarkMode, toggleTheme } = useThemeStore();
  const [profileData, setProfileData] = useState(user || mockCurrentUser);
  const [isDemo, setIsDemo] = useState(!user);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setIsDemo(false);
    } else {
      setProfileData(mockCurrentUser);
      setIsDemo(true);
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    if (isDemo) {
      Alert.alert(
        'Demo Mode',
        'This is a demo profile. Please login to edit your actual profile.',
        [{ text: 'OK' }]
      );
    } else {
      // Navigate to edit profile screen (not implemented yet)
      Alert.alert('Edit Profile', 'Profile editing coming soon!');
    }
  };

  const handleMyRooms = () => {
    router.push('/(tabs)/rooms');
  };

  const handleSettingPress = (setting: string) => {
    Alert.alert(setting, 'This feature is coming soon!');
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isDemo && (
          <View style={styles.demoNotice}>
            <Ionicons name="information-circle-outline" size={16} color={theme.primary} />
            <Text style={styles.demoText}>Demo profile shown - Login to see your actual profile</Text>
          </View>
        )}

        <View style={styles.header}>
          <View style={styles.userInfo}>
            {profileData.avatar ? (
              <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={40} color={theme.textSecondary} />
              </View>
            )}
            
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{profileData.name}</Text>
              <Text style={styles.userHandle}>@{profileData.username}</Text>
              {profileData.bio && <Text style={styles.userBio}>{profileData.bio}</Text>}
              {profileData.external_link && (
                <TouchableOpacity 
                  onPress={() => {
                    if (profileData.external_link) {
                      Alert.alert('External Link', profileData.external_link);
                    }
                  }}
                >
                  <Text style={styles.externalLink}>🔗 {profileData.external_link}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profileData.follower_count}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profileData.following_count}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={20} color={theme.primary} />
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleMyRooms}
          >
            <Ionicons name="grid-outline" size={20} color={theme.primary} />
            <Text style={styles.actionText}>My Rooms</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={theme.text} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary + '80' }}
              thumbColor={isDarkMode ? theme.primary : theme.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleSettingPress('Notifications')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleSettingPress('Privacy')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.text} />
              <Text style={styles.settingText}>Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleSettingPress('Help & Support')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={20} color={theme.text} />
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleSettingPress('About')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={20} color={theme.text} />
              <Text style={styles.settingText}>About i-Recommend</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={isDemo ? () => router.replace('/') : handleLogout}
          >
            <Ionicons name={isDemo ? "log-in-outline" : "log-out-outline"} size={20} color={theme.error} />
            <Text style={styles.logoutText}>{isDemo ? 'Login' : 'Logout'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  demoText: {
    fontSize: 12,
    color: theme.primary,
    marginLeft: 6,
    fontWeight: '500',
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: theme.primary,
    marginBottom: 8,
  },
  userBio: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  externalLink: {
    fontSize: 14,
    color: theme.primary,
    textDecorationLine: 'underline',
  },
  stats: {
    flexDirection: 'row',
    gap: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  statLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primary,
    marginLeft: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.surface,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: theme.text,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.error,
    marginLeft: 8,
  },
});