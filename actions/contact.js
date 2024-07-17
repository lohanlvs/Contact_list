import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthContext } from './authentification';
import { ErrorMessageContext } from './errorMessage';
import jwt_decode from 'jwt-decode';

const initialState = {
    contacts: [],
    contact: null,
    user: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_CONTACTS':
            return {
                ...state,
                contacts: action.payload,
            };
        case 'GET_CONTACT_BY_ID':
            return {
                ...state,
                contact: action.payload,
            };
        case 'SET_CONTACT_BY_ID':
            return {
                ...state,
                contact: action.payload,
            };
        case 'ADD_CONTACT':
            return {
                ...state,
                contacts: [...state.contacts, action.payload],
            };
        case 'GET_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'DELETE_CONTACT':
            return {
                ...state,
                contacts: state.contacts.filter((contact) => contact.id !== action.payload),
            };
        default:
            return state;
    }
}

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { state: authState, secureFetch } = useContext(AuthContext);
    const { setError } = useContext(ErrorMessageContext);

    const fetchContacts = async () => {
        try {
            const response = await secureFetch('http://localhost:3000/api/contacts');
            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'FETCH_CONTACTS', payload: data });
                setError(null);
            } else {
                setError(response.status + ' ' + "erreur lors de la récupération des contacts");
            }
        } catch (error) {
            setError("Network error: " + error.message);
        }
    };

    const getContactById = async (id) => {
        try {
            const response = await secureFetch(`http://localhost:3000/api/contact/${id}`);
            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'GET_CONTACT_BY_ID', payload: data });
                setError(null);
            } else {
                setError(response.status + ' ' + "erreur lors de la récupération d'un contact");
            }
        } catch (error) {
            setError("Network error: " + error.message);
        }
    };

    const setContactById = async (contact) => {
        try {
            const response = await secureFetch(`http://localhost:3000/api/contact/${contact.id}`, 'PUT', JSON.stringify(contact));
            if (response.ok) {
                dispatch({ type: 'SET_CONTACT_BY_ID', payload: contact });
                fetchContacts();
                setError(null);
            } else {
                setError(response.status + ' ' + "erreur lors de la mise à jour du contact");
            }
        } catch (error) {
            setError("Network error: " + error.message);
        }
    };

    const addContact = async (contact) => {
        try {
            const response = await secureFetch('http://localhost:3000/api/contact', 'POST', JSON.stringify(contact));
            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'ADD_CONTACT', payload: data });
                setError(null);
            } else {
                setError(response.status + ' ' + "erreur lors de la création d'un contact");
            }
        } catch (error) {
            setError("Network error: " + error.message);
        }
    };

    const deleteContact = async (id) => {
        try {
            const response = await secureFetch(`http://localhost:3000/api/contact/${id}`, 'DELETE');
            if (response.ok) {
                dispatch({ type: 'DELETE_CONTACT', payload: id });
                setError(null);
            } else {
                setError(response.status + ' ' + "erreur lors de la suppression d'un contact");
            }
        } catch (error) {
            setError("Network error: " + error.message);
        }
    };

    const getUser = async () => {
        try {
            const response = await secureFetch('http://localhost:3000/me');
            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'GET_USER', payload: data.name });
                setError(null);
            } else if (response.status === 404) {
                await secureFetch('http://localhost:3000/api/user', 'POST', JSON.stringify({
                    id: jwt_decode(authState.jwt).sub,
                    name: authState.login,
                }));
                dispatch({ type: 'GET_USER', payload: authState.login });
            } else {
                setError(response.status + ' ' + "erreur lors de la récupération de l'utilisateur");
            }
        } catch (error) {
            setError("Network error: " + error.message);
        }
    };

    useEffect(() => {
        if (authState.isAuthenticated) {
            getUser();
        }
    }, [authState.isAuthenticated]);

    return (
        <ContactContext.Provider value={{ state, fetchContacts, getContactById, setContactById, addContact, getUser, deleteContact }}>
            {children}
        </ContactContext.Provider>
    );
};
