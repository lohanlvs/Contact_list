import React, { createContext, useContext, useEffect, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store'
import { ErrorMessageContext } from './errorMessage';

const initialState = {
    isAuthenticated: false,
    jwt: null,
    refreshToken: null,
    isRegistering: false,
    login: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isAuthenticated: true,
                jwt: action.payload.jwt,
                refreshToken: action.payload.refreshToken,
                login: action.payload.login,
            };
        case 'LOGOUT':
            return {
                isAuthenticated: false,
                jwt: null,
                refreshToken: null,
            };
        case 'REGISTER':
            return {
                ...state,
                isRegistering: true,
            };
        case 'ISREGISTER':
            return {
                ...state,
                isRegistering: false,
            };
        default:
            return state;
    }
}

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { setError } = useContext(ErrorMessageContext);
    const login = async (username, password) => {
        const response = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: username, password }),
        });
        if (response.ok) {
            const {jwt, refreshToken} = await response.json();
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            dispatch({
                type: 'LOGIN',
                payload: { jwt, refreshToken, login: username },
            });
            setError(null);
        } else {
            setError(response.status + ' ' + "erreur lors de la connexion")
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('refreshToken');
        dispatch({
            type: 'LOGOUT',
        });
    };

    const refreshJwt = async (refreshToken) => {
        const response = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken }),
        });
        if (response.ok) {
            const data = await response.json();
            dispatch({
                type: 'LOGIN',
                payload: data,
            });
            setError(null);
            return data.jwt;
        } else {
            setError(response.status + ' ' + 'erreur lors du rafraîchissement du jeton');
            await SecureStore.deleteItemAsync('refreshToken');
            dispatch({
                type: 'LOGOUT',
            });
        }
    };

    const tryAutoLogin = async () => {
        const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
        if (storedRefreshToken) {
            await refreshJwt(storedRefreshToken);
        } else {
            setError('Veuillez vous reconnecter');
        }
    };

    const register = async (username, password) => {
        const response = await fetch('http://localhost:8000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: username, password }),
        });
        if (response.ok) {
            dispatch({
                type: 'ISREGISTER',
            });
            setError(null);
            return true;
        } else {
            setError(response.status + ' ' + "erreur lors de l'inscription")
        }
    };

    const isRegister = async () => {
        dispatch({
            type: 'REGISTER',
        });
    };

    const secureFetch = async (url, method = 'GET', body) => {
        let headers =  {
            'Authorization': `Bearer ${state.jwt}`,
            'Content-Type': 'application/json',
        };
        let response = await fetch(url, {
            body,
            method,
            headers
        });
        if (response.status === 401) {
            const responseBody = await response.json();
            if (responseBody.code === 'tokenexpired') {
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                if (refreshToken) {
                    const jwt = await refreshJwt(refreshToken);
                    headers["Authorization"] = `Bearer ${jwt}`;
                    response = await fetch(url, {body, method, headers});
                } else {
                    throw new Error('Veuillez vous reconnecter');
                }
            }
        }
        return response;
    };

    useEffect(() => {
        tryAutoLogin();
    }, []);

    return (
        <AuthContext.Provider value={{ state, login, logout, isRegister, register, secureFetch }}>
            {children}
        </AuthContext.Provider>
    );
}
