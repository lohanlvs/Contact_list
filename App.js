import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Header from './components/header';
import Constants from 'expo-constants';
import Accueil from './components/accueil';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactList from './components/contactsList';
import { Error } from './components/error';
import { AuthContext, AuthProvider } from './actions/authentification';
import { ContactProvider } from './actions/contact';
import { ErrorMessageProvider } from './actions/errorMessage';
import AddContact from './components/addContact';
import { useContext } from 'react';
import Contact from './components/contact';
import Register from './components/register';

function AuthGuard({ children }) {
    const { state } = useContext(AuthContext);
    if (!state.isAuthenticated) {
        return <Accueil />;
    }

    return children;
}

export default function App() {
    const Stack = createNativeStackNavigator();

    return (
        <ErrorMessageProvider>
            <AuthProvider>
                <ContactProvider>
                    <NavigationContainer>
                        <View style={styles.container}>
                            <Stack.Navigator>
                                <Stack.Screen
                                    name="Accueil"
                                    component={Accueil}
                                    options={{ header: () => <Header title="NavBar" /> }}
                                />
                                <Stack.Screen
                                    name="Register"
                                    component={Register}
                                    options={{ header: () => <Header title="Register" back /> }}
                                />
                                <Stack.Screen
                                    name="AddContact"
                                    options={{ header: () => <Header title="AddContact" back disconnect /> }}
                                >
                                    {() => (
                                        <AuthGuard>
                                            <AddContact />
                                        </AuthGuard>
                                    )}
                                </Stack.Screen>
                                <Stack.Screen
                                    name="Contacts"
                                    options={{ header: () => <Header title="ContactList" disconnect /> }}
                                >
                                    {() => (
                                        <AuthGuard>
                                            <ContactList />
                                        </AuthGuard>
                                    )}
                                </Stack.Screen>
                                <Stack.Screen
                                    name="Contact"
                                    options={{ header: () => <Header title="Contact" back disconnect /> }}
                                >
                                    {() => (
                                        <AuthGuard>
                                            <Contact />
                                        </AuthGuard>
                                    )}
                                </Stack.Screen>
                            </Stack.Navigator>
                            <StatusBar style="auto" />
                        </View>
                        <Error message="Pas d'erreur"/>
                    </NavigationContainer>
                </ContactProvider>
            </AuthProvider>
        </ErrorMessageProvider>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Constants.statusBarHeight,
    },
});
