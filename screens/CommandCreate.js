import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const CommandCreate = ({ navigation }) => {
    const [commandList, setCommandList] = useState([]);
    const [raspberryList, setRaspberryList] = useState([]);
    const [selectedCommand, setSelectedCommand] = useState(null);
    const [selectedRaspberry, setSelectedRaspberry] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState({ command: false, raspberry: false });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Cargar comandos disponibles
            const commandsResponse = await api.get('/bot/commands/list/');
            setCommandList(commandsResponse.data);
            
            // Cargar raspberries disponibles
            const raspberriesResponse = await api.get('/bot/raspberries/list/');
            setRaspberryList(raspberriesResponse.data);
            
            // Log all
            console.log('Comandos:', commandsResponse.data);
            console.log('Raspberries:', raspberriesResponse.data);
            
        } catch (error) {
            console.error('Error cargando datos:', error);
            Alert.alert('Error', 'No se pudieron cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        // Validaciones
        if (!selectedCommand) {
            Alert.alert('Error', 'Selecciona un comando');
            return;
        }
        
        if (!selectedRaspberry) {
            Alert.alert('Error', 'Selecciona una Raspberry Pi');
            return;
        }

        try {
            setLoading(true);
            
            // Enviar comando a ejecutar
            const response = await api.post('/bot/history/', {
                command_slug: selectedCommand.slug,
                raspberry_slug: selectedRaspberry.slug
            });
            
            console.log('Comando enviado:', response.data);

            const createdCommandId = response.data.id || response.data.command_id;
            const createdCommandName = response.data.command_name || selectedCommand.name;
            
            Alert.alert(
                'Éxito', 
                'Comando enviado correctamente',
                [
                    { 
                        text: 'OK', 
                        onPress: () => {
                            // Limpiar selección
                            setSelectedCommand(null);
                            setSelectedRaspberry(null);

                            navigation.navigate('Details', {
                                commandId: createdCommandId,
                                commandName: createdCommandName
                            });
                        }
                    }
                ]
            );
            
        } catch (error) {
            console.error('Error enviando comando:', error);
            Alert.alert('Error', 'No se pudo enviar el comando');
        } finally {
            setLoading(false);
        }
    };

    // Renderizar item para la lista de raspberries
    const renderRaspberryItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.modalItem}
            onPress={() => {
                setSelectedRaspberry(item);
                setModalVisible({ ...modalVisible, raspberry: false });
            }}
        >
            <Text style={styles.modalItemText}>{item.name}</Text>
            {item.ip_address && (
                <Text style={styles.modalItemSubtext}>IP: {item.ip_address}</Text>
            )}
        </TouchableOpacity>
    );

    // Renderizar item para la lista de comandos
    const renderCommandItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.modalItem}
            onPress={() => {
                setSelectedCommand(item);
                setModalVisible({ ...modalVisible, command: false });
            }}
        >
            <Text style={styles.modalItemText}>{item.name}</Text>
            {item.description && (
                <Text style={styles.modalItemSubtext}>{item.description}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                {/* Selector de Raspberry Pi - estilo SELECT */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Raspberry Pi:</Text>
                    <TouchableOpacity 
                        style={styles.selectBox}
                        onPress={() => setModalVisible({ ...modalVisible, raspberry: true })}
                    >
                        <Text style={[
                            styles.selectText,
                            !selectedRaspberry && styles.placeholderText
                        ]}>
                            {selectedRaspberry 
                                ? `${selectedRaspberry.name} ${selectedRaspberry.ip_address ? `(${selectedRaspberry.ip_address})` : ''}`
                                : '-- Selecciona una Raspberry --'}
                        </Text>
                        <Text style={styles.selectArrow}>▼</Text>
                    </TouchableOpacity>
                </View>

                {/* Selector de Comando - estilo SELECT */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Comando a ejecutar:</Text>
                    <TouchableOpacity 
                        style={styles.selectBox}
                        onPress={() => setModalVisible({ ...modalVisible, command: true })}
                    >
                        <Text style={[
                            styles.selectText,
                            !selectedCommand && styles.placeholderText
                        ]}>
                            {selectedCommand 
                                ? selectedCommand.name
                                : '-- Selecciona un comando --'}
                        </Text>
                        <Text style={styles.selectArrow}>▼</Text>
                    </TouchableOpacity>
                </View>

                {/* Botón de envío */}
                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Enviando...' : 'Ejecutar Comando'}
                    </Text>
                </TouchableOpacity>

                {/* Modal para seleccionar Raspberry */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible.raspberry}
                    onRequestClose={() => setModalVisible({ ...modalVisible, raspberry: false })}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Selecciona Raspberry Pi</Text>
                                <TouchableOpacity 
                                    onPress={() => setModalVisible({ ...modalVisible, raspberry: false })}
                                >
                                    <Text style={styles.modalClose}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {raspberryList.length > 0 ? (
                                <FlatList
                                    data={raspberryList}
                                    renderItem={renderRaspberryItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            ) : (
                                <Text style={styles.modalEmptyText}>No hay raspberries disponibles</Text>
                            )}
                        </View>
                    </View>
                </Modal>

                {/* Modal para seleccionar Comando */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible.command}
                    onRequestClose={() => setModalVisible({ ...modalVisible, command: false })}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Selecciona Comando</Text>
                                <TouchableOpacity 
                                    onPress={() => setModalVisible({ ...modalVisible, command: false })}
                                >
                                    <Text style={styles.modalClose}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {commandList.length > 0 ? (
                                <FlatList
                                    data={commandList}
                                    renderItem={renderCommandItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            ) : (
                                <Text style={styles.modalEmptyText}>No hay comandos disponibles</Text>
                            )}
                        </View>
                    </View>
                </Modal>

                {/* Resumen de selección */}
                {selectedCommand && selectedRaspberry && (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Resumen:</Text>
                        <Text style={styles.summaryText}>
                            <Text style={styles.bold}>Raspberry:</Text> {selectedRaspberry.name}
                        </Text>
                        <Text style={styles.summaryText}>
                            <Text style={styles.bold}>Comando:</Text> {selectedCommand.name}
                        </Text>
                        {selectedCommand.description && (
                            <Text style={styles.summaryText}>
                                <Text style={styles.bold}>Descripción:</Text> {selectedCommand.description}
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    form: {
        padding: 20,
        marginTop: 20
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    selectBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    placeholderText: {
        color: '#999',
    },
    selectArrow: {
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#FF6347', // Tomato
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Estilos del Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalClose: {
        fontSize: 20,
        color: '#666',
        padding: 5,
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    modalItemSubtext: {
        fontSize: 14,
        color: '#666',
    },
    modalEmptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#999',
        fontSize: 16,
    },
    summaryContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#e8f4fd',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#b8e0ff',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0066cc',
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default CommandCreate;