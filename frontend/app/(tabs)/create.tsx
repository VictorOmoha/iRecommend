import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

export default function CreateScreen() {
  useFocusEffect(
    React.useCallback(() => {
      // Navigate to create-post when this tab is focused
      router.push('/create-post');
    }, [])
  );

  return <View />;
}