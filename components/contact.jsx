import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, TextInput } from 'react-native';
import { ContactContext } from '../actions/contact';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

const Contact = () => {
    const { state, setContactById, deleteContact } = useContext(ContactContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContact, setEditedContact] = useState({...state.contact});
    const navigation = useNavigation();
    useEffect(() => {
        setEditedContact({...state.contact});
    }, [state.contact]);
    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleSave = () => {
        setIsEditing(false);
        setContactById(editedContact)
        navigation.navigate('Contacts');
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={state.contact?.avatar ? { uri: state.contact.avatar } : require('../assets/default-user.png')} style={styles.image} />
            {isEditing ? (
                <>
                    <TextInput style={styles.input} value={editedContact.lastName} onChangeText={(text) => setEditedContact({...editedContact, lastName: text})} />
                    <TextInput style={styles.input} value={editedContact.firstName} onChangeText={(text) => setEditedContact({...editedContact, firstName: text})} />
                    <TextInput style={styles.input} value={editedContact.email} onChangeText={(text) => setEditedContact({...editedContact, email: text})} />
                    <TextInput style={styles.input} value={editedContact.phone} onChangeText={(text) => setEditedContact({...editedContact, phone: text})} />
                    <View style={styles.buttonContainer}>
                        <Button title="Save" onPress={handleSave} color="#9b59b6"/>
                        <Button title="Cancel" onPress={() => setIsEditing(false)} color="#9b59b6" />
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.contactItem}>
                        <Text style={styles.contactText}>{state?.contact?.lastName}</Text>
                    </View>
                    <View style={styles.contactItem}>
                        <Text style={styles.contactText}>{state?.contact?.firstName}</Text>
                    </View>
                    <View style={styles.contactItem}>
                        <Text style={styles.contactText}>{state?.contact?.email}</Text>
                    </View>
                    <View style={styles.contactItem}>
                        <Text style={styles.contactText}>{state?.contact?.phone}</Text>
                    </View>
                    <View style={styles.buttonItem}>
                        <Button title="Call" onPress={() => {}} color="#9b59b6"/>
                        <Button title="Edit" onPress={handleEdit} color="#9b59b6" />
                        <Button title="Delete" onPress={() => {deleteContact(state.contact.id); navigation.navigate('Contacts');}}  color="#9b59b6" />
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#282c34',
    },
    contactItem: {
        backgroundColor: '#3d3d3d',
        marginBottom: 10,
        padding: 20,
        borderRadius: 5,
        borderColor: '#9b59b6',
        borderWidth: 2,
    },
    contactText: {
        fontSize: 18,
        color: '#ffffff',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 100,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: 'white'
    },
    buttonItem: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    input: {
        backgroundColor: '#3d3d3d',
        marginBottom: 10,
        padding: 20,
        borderRadius: 5,
        borderColor: '#61dafb',
        borderWidth: 2,
        color: '#ffffff',
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default Contact;
