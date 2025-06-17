// src/navigation/AppNavigator.js
import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UsersList from '../screens/UsersList';
import UserModal from '../screens/UserModal';
import Splash from '../screens/Splash';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen 
          name="Splash" 
          component={Splash} 
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="UsersList"
          component={UsersList}
          options={() => ({
            title: 'User List',
            headerStyle: { backgroundColor: colors.primary },
            headerTitleStyle: { fontWeight: 'bold' },
            headerTintColor: '#fff',
          })}
        />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="UserModal"
            component={UserModal}
            options={{ title: 'Add / Edit User' }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
