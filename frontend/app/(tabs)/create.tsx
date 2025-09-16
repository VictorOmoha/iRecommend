import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

export default function CreateScreen() {
  useFocusEffect(
    React.useCallback(() => {
      // Navigate to create-post when this tab is focused
      router.push('/create-post');
      
      // Return to previous tab after navigation
      return () => {
        // This cleanup function runs when the screen loses focus
      };
    }, [])
  );

  return <View style={{ flex: 1, backgroundColor: 'transparent' }} />;
}