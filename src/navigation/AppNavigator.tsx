import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AddPetScreen from '../screens/AddPetScreen';
import PetDetailScreen from '../screens/PetDetailScreen';
import JournalScreen from '../screens/JournalScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import FunFactsScreen from '../screens/FunFactsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPet"
        component={AddPetScreen}
        options={{
          title: 'Add Pet',
          headerStyle: { backgroundColor: '#4a90d9' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="PetDetail"
        component={PetDetailScreen}
        options={{
          title: 'Pet Details',
          headerStyle: { backgroundColor: '#4a90d9' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          title: 'Journal',
          headerStyle: { backgroundColor: '#4a90d9' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4a90d9',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Facts"
        component={FunFactsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon emoji="💡" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
