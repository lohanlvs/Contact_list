import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../actions/authentification';

export default function Accueil() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const { state, login, isRegister } = useContext(AuthContext);
    const onLogin = async () => {
        await login(userName, password);
    };

    const onRegister = async () => {
        isRegister();
        navigation.navigate('Register');
    };

    useEffect(() => {
        if (state.isAuthenticated) {
            navigation.navigate('Contacts');
        }
    }, [state.isAuthenticated]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <TextInput
                value={userName}
                onChangeText={(newName) => setUserName(newName)}
                placeholder={'User Name'}
                placeholderTextColor="#888"
                style={styles.input}
            />
            <TextInput
                value={password}
                onChangeText={(newPassword) => setPassword(newPassword)}
                placeholder={'Password'}
                placeholderTextColor="#888"
                secureTextEntry={true}
                style={styles.input}
            />
            <View style={styles.subContainer}>
                <View style={styles.buttonContainer}>
                    <Button
                        title={'Login'}
                        onPress={onLogin}
                        color="#61dafb"
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title={'Register'}
                        onPress={onRegister}
                        color="#61dafb"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#282c34',
    },
    title: {
        fontSize: 32,
        marginBottom: 30,
        color: '#61dafb',
        fontWeight: 'bold',
    },
    subContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#61dafb',
        borderWidth: 2,
        marginBottom: 20,
        paddingHorizontal: 15,
        color: '#ffffff',
        backgroundColor: '#3d3d3d',
        borderRadius: 5,
    },
    buttonContainer: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 5,
        overflow: 'hidden',
    },
});
