import React, { useContext, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import { ContactContext } from '../actions/contact';
import { useNavigation } from '@react-navigation/native';

const ContactList = () => {
    const { state, fetchContacts, getContactById } = useContext(ContactContext);
    const navigation = useNavigation();

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button
                    title="Ajouter un contact"
                    onPress={() => { navigation.navigate('AddContact'); }}
                    color="#61dafb"
                />
            </View>
            {state?.contacts.map((contact) => (
                <View key={contact.id} style={styles.contactItem}>
                    <Text style={styles.contactText} onPress={() => {
                        getContactById(contact.id);
                        navigation.navigate('Contact');
                    }}>
                        {contact.firstName} {contact.lastName}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#2c3e50',
    },
    buttonContainer: {
        marginBottom: 20,
    },
    contactItem: {
        backgroundColor: '#8e44ad',
        marginBottom: 10,
        padding: 20,
        borderRadius: 5,
        borderColor: '#9b59b6',
        borderWidth: 2,
        marginTop: 50,
    },
    contactText: {
        fontSize: 18,
        color: '#ecf0f1',
    }
});

export default ContactList;
