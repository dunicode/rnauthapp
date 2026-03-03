import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'; // Importar useFocusEffect
import api from '../services/api';

const CommandDetail = ({ navigation, route }) => {
    const { commandId, commandName } = route.params;
    const [command, setCommand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const getCommandDetail = async (showRefreshing = false) => {
        try {
            if (showRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            
            // Llamada a la API para obtener el detalle específico del comando
            const response = await api.get(`/bot/history/${commandId}/`);
            setCommand(response.data);
            console.log('Detalle del comando:', response.data);
            
        } catch (error) {
            console.error('Error al obtener detalle del comando:', error);
            setError('No se pudo cargar la información del comando');
            Alert.alert('Error', 'Error al cargar los detalles del comando');
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
        getCommandDetail(true);
    }, [commandId]);

    // Opción 1: Usar useFocusEffect para recargar cada vez que la pantalla gana foco
    useFocusEffect(
        useCallback(() => {
            console.log('Pantalla enfocada - recargando datos');
            getCommandDetail(false);
            
            // Opcional: Limpiar o cancelar peticiones si es necesario
            return () => {
                console.log('Pantalla perdió el foco');
                // Aquí podrías cancelar peticiones pendientes si las hubiera
            };
        }, [commandId]) // Dependencia: commandId
    );

    // Opción 2: También mantener el useEffect tradicional para la carga inicial
    useEffect(() => {
        // Establecer el título dinámicamente
        navigation.setOptions({
            title: commandName || 'Detalles del Comando'
        });
    }, [navigation, commandName]);

    // Si prefieres no usar useFocusEffect, puedes usar el evento 'focus' de navigation
    // Opción 3: Usar el evento focus del navigation (alternativa)
    /*
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('Pantalla enfocada - recargando datos (evento focus)');
            getCommandDetail(false);
        });

        // Carga inicial
        getCommandDetail(false);

        return unsubscribe;
    }, [navigation, commandId]);
    */

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Función para obtener el color según el estado
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'success':
            case 'completado':
            case 'éxito':
                return '#4CAF50'; // Verde
            case 'pending':
            case 'pendiente':
            case 'en progreso':
                return '#FFC107'; // Amarillo
            case 'error':
            case 'failed':
            case 'fallido':
                return '#F44336'; // Rojo
            default:
                return '#999999'; // Gris
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={styles.loadingText}>Cargando detalles...</Text>
            </View>
        );
    }

    if (error || !command) {
        return (
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.centerContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#FF6347']}
                        tintColor={'#FF6347'}
                        title="Actualizando..."
                        titleColor={'#FF6347'}
                    />
                }
            >
                <Text style={styles.errorText}>{error || 'No se encontró el comando'}</Text>
            </ScrollView>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#FF6347']}
                    tintColor={'#FF6347'}
                    title="Actualizando..."
                    titleColor={'#FF6347'}
                />
            }
        >
            <View style={styles.card}>
                {/* ID del Comando */}
                <View style={styles.section}>
                    <Text style={styles.label}>ID del Comando</Text>
                    <Text style={styles.value}>{command.id}</Text>
                </View>

                {/* Nombre del Comando */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nombre del Comando</Text>
                    <Text style={styles.value}>{command.command_name || commandName}</Text>
                </View>

                {/* Raspberry Pi */}
                {command.raspberry_name && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Raspberry Pi</Text>
                        <Text style={styles.value}>{command.raspberry_name}</Text>
                    </View>
                )}

                {/* Estado */}
                {command.status && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Estado</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(command.status) }]}>
                            <Text style={styles.statusText}>{command.status}</Text>
                        </View>
                    </View>
                )}

                {/* Resultado */}
                {command.result && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Resultado</Text>
                        <View style={styles.resultContainer}>
                            <Text style={styles.resultText}>{command.result}</Text>
                        </View>
                    </View>
                )}

                {/* Fechas */}
                <View style={styles.section}>
                    <Text style={styles.label}>Creado</Text>
                    <Text style={styles.dateText}>{formatDate(command.created_at)}</Text>
                </View>

                {command.updated_at && command.updated_at !== command.created_at && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Actualizado</Text>
                        <Text style={styles.dateText}>{formatDate(command.updated_at)}</Text>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    section: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
        fontWeight: '500',
    },
    value: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    resultContainer: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    resultText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    dateText: {
        fontSize: 16,
        color: '#555',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
    },
});

export default CommandDetail;