import React from 'react';
import Home from '../screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons'; // o la librería de iconos que prefieras
import CommandHistory from '../screens/CommandHistory';

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
        tabBarLabel: 'Home',
        }} 
      />
      <Tab.Screen 
        name="Commands" 
        component={CommandHistory} 
        options={{tabBarIcon: ({ color, size }) => (
          <Ionicons name="albums" size={size} color={color} />
        ),
        tabBarLabel: 'Commands',
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
        tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;