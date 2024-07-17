import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({ jwt: null, refreshToken: null });

    useEffect(() => {
        const loadTokens = async () => {
            const jwt = await AsyncStorage.getItem('jwt');
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (jwt && refreshToken) {
                setAuthState({ jwt, refreshToken });
            }
        };
        loadTokens();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/auth/login', { username, password });
            const { jwt, refreshToken } = response.data;
            await AsyncStorage.setItem('jwt', jwt);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            setAuthState({ jwt, refreshToken });
        } catch (err) {
            throw new Error('Login failed');
        }
    };

    const refreshJwt = async () => {
        try {
            const response = await axios.post('http://localhost:8000/auth/login', { token: authState.refreshToken });
            const { jwt } = response.data;
            await AsyncStorage.setItem('jwt', jwt);
            setAuthState((prevState) => ({ ...prevState, jwt }));
        } catch (err) {
            throw new Error('Failed to refresh token');
        }
    };

    return (
        <AuthContext.Provider value={{ authState, login, refreshJwt }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext
