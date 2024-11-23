import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CheckpointList from '../screens/CheckpointList';
import CheckpointVerification from '../screens/CheckpointVerification';
import SupervisorSetup from '../screens/SupervisorSetup';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="CheckpointList"
                    component={CheckpointList}
                    options={{ title: 'Güvenlik Takip' }}
                />
                <Stack.Screen
                    name="CheckpointVerification"
                    component={CheckpointVerification}
                    options={{ title: 'Verify Location' }}
                />
                <Stack.Screen
                    name="SupervisorSetup"
                    component={SupervisorSetup}
                    options={{ title: 'Setup Checkpoints' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};