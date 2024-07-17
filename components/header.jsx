import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../actions/authentification';
import { ContactContext } from '../actions/contact';

export default function Header({ title, disconnect, back }) {
    const navigation = useNavigation();
    const { state: authState, logout } = useContext(AuthContext);
    const { state: contactState } = useContext(ContactContext);

    const [user, setUser] = useState(contactState?.user);


    useEffect(() => {
        if (!authState.isAuthenticated && !authState.isRegistering) {
            navigation.navigate('Accueil');
        }
    }, [authState.isAuthenticated, authState.isRegistering, navigation]);

    useEffect(() => {
        setUser(contactState?.user);
    }, [contactState?.user]);

    const handleLogout = () => {
        logout();
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.header}>
            {back && <Button title="Back" onPress={handleBack} color="#61dafb" />}
            <Text style={styles.title}>{authState.login || title}</Text>
            {disconnect && <Button title="Disconnect" onPress={handleLogout} color="#61dafb" />}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#20232a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: '#61dafb',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
