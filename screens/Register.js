import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import api from '../services/api';

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !password_confirm) {
      if (Platform.OS === 'web') {
        alert('Error: Por favor completa todos los campos');
        return;
      }else{
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }
    }

    if (password != password_confirm) {
      if (Platform.OS === 'web') {
        alert('Error: Las contraseñas no coinciden');
        return;
      }else{
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      if (Platform.OS === 'web') {
        alert('Registro completado. Por favor inicia sesión.');
        navigation.navigate('Login')
      }else{
        Alert.alert(
          'Éxito', 
          'Registro completado. Por favor inicia sesión.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
      
    } catch (error) {
      console.error('Error registro:', error.response?.data || error.message);
      if (Platform.OS === 'web') {
        alert('Error: Error en el registro. Verifica los datos.');
      }else{
        Alert.alert('Error', 'Error en el registro. Verifica los datos.');
      }      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password Confirm"
        value={password_confirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
        editable={!isLoading}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Register;