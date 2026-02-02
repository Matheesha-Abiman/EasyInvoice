// Main App Entry Point - TypeScript with NativeWind
import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RootStackParamList } from './types';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import BillsListScreen from './screens/BillsListScreen';
import CreateBillScreen from './screens/CreateBillScreen';
import BillDetailsScreen from './screens/BillDetailsScreen';
import EditBillScreen from './screens/EditBillScreen';
import LoadingSpinner from './components/LoadingSpinner';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Auth Stack - for unauthenticated users
const AuthStack: React.FC = () => (
    <Stack.Navigator
        id="AuthStack"
        screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0F172A' },
        }}
    >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

// Main Stack - for authenticated users
const MainStack: React.FC = () => (
    <Stack.Navigator
        id="MainStack"
        screenOptions={{
            headerStyle: { backgroundColor: '#0F172A' },
            headerShadowVisible: false,
            headerTintColor: '#F8FAFC',
            headerTitleStyle: { fontWeight: '700', fontSize: 20 },
            headerBackVisible: true,
            contentStyle: { backgroundColor: '#0F172A' },
        }}
    >
        <Stack.Screen
            name="BillsList"
            component={BillsListScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="CreateBill"
            component={CreateBillScreen}
            options={{ title: 'New Invoice' }}
        />
        <Stack.Screen
            name="BillDetails"
            component={BillDetailsScreen}
            options={{ title: 'Invoice Details' }}
        />
        <Stack.Screen
            name="EditBill"
            component={EditBillScreen}
            options={{ title: 'Edit Invoice' }}
        />
    </Stack.Navigator>
);

// Navigation component that switches based on auth state
const Navigation: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <NavigationContainer>
            {user ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

// Main App component
const App: React.FC = () => {
    return (
        <AuthProvider>
            <StatusBar style="light" />
            <Navigation />
        </AuthProvider>
    );
};

export default App;
