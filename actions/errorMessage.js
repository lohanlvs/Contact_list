import { createContext, useReducer } from "react";

const initialState = {
    errorMessage: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'ERROR':
            return {
                errorMessage: action.payload.errorMessage,
            };
        default:
            return state;
    }
}

export const ErrorMessageContext = createContext();

export function ErrorMessageProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setError = (errorMessage) => {
        dispatch({
            type: 'ERROR',
            payload: { errorMessage },
        });
    };
    return (
        <ErrorMessageContext.Provider value={{ state, setError }}>
            {children}
        </ErrorMessageContext.Provider>
    );
}
