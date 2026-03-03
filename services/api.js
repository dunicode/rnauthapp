import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native'; // Importamos Alert

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error (por ejemplo, token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // Token inválido o expirado, cerramos sesión
      await AsyncStorage.removeItem('userToken');
      
      Alert.alert(
        "Sesión Expirada",
        "Tu sesión ha terminado. Por favor, ingresa de nuevo.",
        [{ text: "OK" }]
      );
    }
    return Promise.reject(error);
  }
);

export default api;