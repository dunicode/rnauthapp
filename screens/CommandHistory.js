import { View, Button, StyleSheet, Alert, Text, StatusBar } from 'react-native'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import mainStyles from '../styles/mainStyles';

const CommandHistory = () => {

    const [commandList, setCommandList] = useState([]);

    const getCommandList = async () => {
        try {
          const response = await api.get('/bot/history/list/');
          setCommandList(response.data);
        } catch (error) {
          Alert.alert('Error', 'Error en petición autenticada');
          console.error('Auth request error:', error);
        }
    };

    useEffect(() => { {
        getCommandList();
      }
    }, []);

    return (
        <View>
        <Text>Command</Text>
        </View>
    )
}

export default CommandHistory