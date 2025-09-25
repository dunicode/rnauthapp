import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const RootNavigator = () => {
  const { isLoading, userToken } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return userToken ? <AppStack /> : <AuthStack />;
};

export default RootNavigator;