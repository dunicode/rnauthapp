import { View, Button, StyleSheet, Alert, Text, StatusBar, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import mainStyles from '../styles/mainStyles';

const CommandHistory = ({ navigation }) => {

    const [commandList, setCommandList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const getCommandList = async (showRefreshing = false) => {
        try {
          if (showRefreshing) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }
          
          const response = await api.get('/bot/history/list/');
          setCommandList(response.data);
          console.log('Comandos recibidos:', response.data);
        } catch (error) {
          Alert.alert('Error', 'Error en petición autenticada');
          console.error('Auth request error:', error);
        } finally {
          if (showRefreshing) {
            setRefreshing(false);
          } else {
            setLoading(false);
          }
        }
    };

    // Función para refrescar mediante pull-to-refresh
    const onRefresh = useCallback(() => {
        getCommandList(true);
    }, []);

    const handleCommandPress = (item) => {
        // Muestra en consola la información del comando seleccionado
        console.log('Comando seleccionado:', item);

        navigation.navigate('Details', {
            commandId: item.id,
            commandName: item.command_name
        });
    };

    const renderCommandItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.commandItem}
            onPress={() => handleCommandPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.commandContent}>
                <Text style={styles.commandName}>
                    {item.command_name || 'Comando sin nombre'}
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
            {!loading && (
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => getCommandList(false)}
                >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    useEffect(() => {
        getCommandList(false);
    }, []);

    return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={false}/>
          
          <FlatList
              data={commandList}
              renderItem={renderCommandItem}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              contentContainerStyle={[
                  styles.listContainer,
                  commandList.length === 0 && styles.emptyListContainer
              ]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                  <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={['#FF6347']} // Android
                      tintColor={'#FF6347'} // iOS
                      title="Actualizando..." // iOS
                      titleColor={'#FF6347'} // iOS
                  />
              }
              ListEmptyComponent={renderEmptyList}
          />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: StatusBar.currentHeight,
      flex: 1,
      justifyContent: 'top',
      backgroundColor: '#fff',
    },
    listContainer: {
        padding: 16,
    },
    emptyListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    commandItem: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        width: '100%',
        alignSelf: 'stretch',
    },
    commandContent: {
        flex: 1,
        width: '100%',
    },
    commandName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        width: '100%',
    },
    commandDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        width: '100%',
    },
    commandDate: {
        fontSize: 12,
        color: '#999',
        width: '100%',
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
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#FF6347',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default CommandHistory;