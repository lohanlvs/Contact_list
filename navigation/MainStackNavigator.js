import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import ContactsListScreen from '../components/ContactsListScreen';
import ContactScreen from '../components/ContactScreen';
import Register from '../components/register';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ContactsList" component={ContactsListScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MainStackNavigator;
