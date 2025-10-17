import { View, Button, StyleSheet, Alert, Text } from 'react-native'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Profile() {
    const { signOut } = useAuth();
    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });

    const getProfileData = async () => {
        try {
          const response = await api.get('/auth/profile');
          setProfileData(response.data);
          console.log(response.data);
        } catch (error) {
          Alert.alert('Error', 'Error en petición autenticada');
          console.error('Auth request error:', error);
        }
    };

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

    useEffect(() => { {
        getProfileData();
      }
    }, []);

    return (
        <View style={styles.container}>
            
            <View style={styles.buttonContainer}>
                <Text style={styles.title}>Perfil de Usuario</Text>
                <Text style={styles.subtitle}>Nombre: {profileData.name || ""}</Text>
                <Text style={styles.subtitle}>Email: {profileData.email || ""}</Text>
                <View style={styles.spacer} />
                <Button title="Cerrar Sesión" onPress={handleLogout} color="red" />
            </View>
        </View>
    )
}

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
    marginBottom: 10,
    color: '#666',
  },
  buttonContainer: {
    width: '80%',
  },
  spacer: {
    height: 10,
  },
});
