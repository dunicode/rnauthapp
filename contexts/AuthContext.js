import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const checkLoginState = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    } catch (error) {
      console.error('Error al verificar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLoginState();
  }, []);

  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    } catch (error) {
      console.error('Error al guardar token:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value = {
    isLoading,
    userToken,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};