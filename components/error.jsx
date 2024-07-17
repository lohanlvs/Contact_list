import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ErrorMessageContext } from '../actions/errorMessage';

export function Error({ message }) {
    const { state: { errorMessage } } = useContext(ErrorMessageContext);

    return (
        <View style={styles.container}>
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {errorMessage || message}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#20232a',
    },
    errorContainer: {
        backgroundColor: 'grey',
        borderRadius: 10,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,

    },
    errorText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,

    },
});
