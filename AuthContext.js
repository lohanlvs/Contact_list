import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...state,
                userToken: action.token,
                isLoading: false,
            };
        case 'SIGN_IN':
            return {
                ...state,
                isSignout: false,
                userToken: action.token,
            };
        case 'SIGN_OUT':
            return {
                ...state,
                isSignout: true,
                userToken: null,
            };
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const bootstrapAsync = async () => {
            let userToken;

            try {
                userToken = await AsyncStorage.getItem('accessToken');
            } catch (e) {
                console.error('Restoring token failed', e);
            }

            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };

        bootstrapAsync();
    }, []);

    const authContext = {
        signIn: async (data) => {
            const response = await axios.post('http://localhost:8000/auth/signin', data);
            const { accessToken, refreshToken } = response.data;

            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);

            dispatch({ type: 'SIGN_IN', token: accessToken });
        },
        signOut: async () => {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');

            dispatch({ type: 'SIGN_OUT' });
        },
        signUp: async (data) => {
            const response = await axios.post('http://localhost:8000/auth/signup', data);
            const { accessToken, refreshToken } = response.data;

            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);

            dispatch({ type: 'SIGN_IN', token: accessToken });
        },
    };

    return (
        <AuthContext.Provider value={{ state, authContext }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
