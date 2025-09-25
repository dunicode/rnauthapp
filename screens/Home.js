import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Home = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            try {
              // Opcional: llamar al endpoint de logout de tu API si existe
              // await api.post('/auth/logout');
            } catch (error) {
              console.error('Error logout:', error);
            } finally {
              await signOut();
            }
          },
        },
      ]
    );
  };

  const testAuthRequest = async () => {
    try {
      const response = await api.get('/auth/profile');
      Alert.alert('Éxito', 'Petición autenticada exitosa');
      console.log('User data:', response.data);
    } catch (error) {
      Alert.alert('Error', 'Error en petición autenticada');
      console.error('Auth request error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Home</Text>
      <Text style={styles.subtitle}>Sesión iniciada correctamente</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Probar Petición Autenticada" onPress={testAuthRequest} />
        <View style={styles.spacer} />
        <Button title="Cerrar Sesión" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    width: '80%',
  },
  spacer: {
    height: 10,
  },
});

export default Home;