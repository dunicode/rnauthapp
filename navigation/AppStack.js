import React from 'react';
import Home from '../screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons'; // o la librería de iconos que prefieras

const Tab = createBottomTabNavigator();

const AppStack = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
        tabBarLabel: 'Inicio',
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
        tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;