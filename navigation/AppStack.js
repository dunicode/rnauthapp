import React from 'react';
import Home from '../screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons'; // o la librería de iconos que prefieras
import CommandHistory from '../screens/CommandHistory';
import CommandDetail from '../screens/CommandDetail';
import CommandCreate from '../screens/CommandCreate';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
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
        name="Create" 
        component={CommandCreate} 
        options={{tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle-outline" size={size} color={color} />
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

const AppStack = () => {
  return (
  <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabs} 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="Details" 
        component={CommandDetail}
        options={{ 
          title: 'Detalles',
        }}
      />
    </Stack.Navigator>
  )
};

export default AppStack;