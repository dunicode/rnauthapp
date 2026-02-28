import { View, Button, StyleSheet, Alert, Text, StatusBar, FlatList, TouchableOpacity } from 'react-native'
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
          console.log('Comandos recibidos:', response.data);
        } catch (error) {
          Alert.alert('Error', 'Error en petición autenticada');
          console.error('Auth request error:', error);
        }
    };

    const handleCommandPress = (item) => {
        // Muestra en consola la información del comando seleccionado
        console.log('Comando seleccionado:', item);
        // Puedes personalizar el mensaje según los campos que tenga tu comando
        console.log(`ID: ${item.id || 'N/A'}, Comando: ${item.command || item.name || 'Sin nombre'}`);
    };

    const renderCommandItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.commandItem}
            onPress={() => handleCommandPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.commandContent}>
                <Text style={styles.commandName}>
                    {item.command || item.name || 'Comando sin nombre'}
                </Text>
                {item.description && (
                    <Text style={styles.commandDescription}>
                        {item.description}
                    </Text>
                )}
                {item.date && (
                    <Text style={styles.commandDate}>
                        {item.date}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay comandos disponibles</Text>
        </View>
    );

    useEffect(() => {
        getCommandList();
    }, []);

    return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={false}/>
          
          {commandList.length > 0 ? (
            <FlatList
                data={commandList}
                renderItem={renderCommandItem}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyList()
          )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: StatusBar.currentHeight,
      flex: 1,
      justifyContent: 'top',
    },
    listContainer: {
        padding: 16,
    },
    commandItem: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        width: '100%', // Asegura que ocupe el ancho completo
        alignSelf: 'stretch', // Se estira para ocupar el ancho disponible
    },
    commandContent: {
        flex: 1,
        width: '100%', // El contenido también ocupa el ancho completo
    },
    commandName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        width: '100%', // Texto ocupa ancho completo
    },
    commandDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        width: '100%', // Texto ocupa ancho completo
    },
    commandDate: {
        fontSize: 12,
        color: '#999',
        width: '100%', // Texto ocupa ancho completo
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
});

export default CommandHistory;