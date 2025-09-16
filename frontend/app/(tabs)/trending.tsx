import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TrendingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.emptyContainer}>
        <Ionicons name="flame-outline" size={64} color="#8E8E93" />
        <Text style={styles.emptyTitle}>Trending Coming Soon</Text>
        <Text style={styles.emptyDescription}>
          We're working on the trending algorithm to show you the most popular recommendations.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  },
});