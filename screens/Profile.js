import { View, Button, StyleSheet, Alert, Text, StatusBar } from 'react-native'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import mainStyles from '../styles/mainStyles';

export default function Profile() {
    const { signOut } = useAuth();
    const [profileData, setProfileData] = useState({
        username: '',
        email: ''
    });

    const getProfileData = async () => {
        try {
          const response = await api.get('/auth/profile/');
          setProfileData(response.data);
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
            <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={false}/>

            <View style={mainStyles.card}>
                <Text style={styles.title}>Profile</Text>
                <Text style={styles.subtitle}>Username: {profileData.username || ""}</Text>
                <Text style={styles.subtitle}>Email: {profileData.email || ""}</Text>              
            </View>

            <View style={mainStyles.card}>
                <Text style={styles.title}>Options</Text>
                <View style={mainStyles.spacer} />
                <Button title="Cerrar Sesión" onPress={handleLogout} color="gray" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
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
});
