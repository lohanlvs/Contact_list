import { useContext, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ContactContext } from "../actions/contact";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";

const AddContact = () => {
    const [contact, setContact] = useState({lastName: '', firstName: '', email: '', phone: '', avatar: ''});
    const { addContact } = useContext(ContactContext);
    const navigation = useNavigation();
    const handleSave = () => {
        addContact(contact);
        navigation.navigate('Contacts');
    };
    return (
        <ScrollView style={styles.container}>
            <Image source={require("../assets/default-user.png")} style={styles.image} />
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} value={contact.lastName} onChangeText={(text) => setContact({...contact, lastName: text})} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <TextInput style={styles.input} value={contact.firstName} onChangeText={(text) => setContact({...contact, firstName: text})} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={contact.email} onChangeText={(text) => setContact({...contact, email: text})} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone</Text>
                <TextInput style={styles.input} value={contact.phone} onChangeText={(text) => setContact({...contact, phone: text})} />
            </View>
            <Button title="Save" onPress={handleSave} />
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#282c34',
    },
    contactItem: {
        backgroundColor: '#3d3d3d',
        marginBottom: 10,
        padding: 20,
        borderRadius: 5,
        borderColor: '#61dafb',
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
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 10,
    },
});

export default AddContact;
