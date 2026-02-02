// Login Screen - NativeWind
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { RootStackParamList } from '../types';
import { Feather } from '@expo/vector-icons';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { login } = useAuth();

    const handleLogin = async (): Promise<void> => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }
        if (!password) {
            Alert.alert('Error', 'Please enter your password');
            return;
        }

        setLoading(true);
        const result = await login(email.trim(), password);
        setLoading(false);

        if (!result.success) {
            Alert.alert('Login Failed', result.error);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Decorative Circles */}
                <View className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl opacity-50" />
                <View className="absolute -bottom-12 -left-24 w-48 h-48 rounded-full bg-secondary/10 blur-3xl opacity-50" />

                {/* Header */}
                <View className="items-center mb-10">
                    <View className="w-20 h-20 rounded-2xl bg-primary justify-center items-center mb-6 shadow-xl shadow-primary/30 rotate-3">
                        <Feather name="box" size={36} color="white" />
                    </View>
                    <Text className="text-4xl font-bold text-text mb-2 tracking-tight">
                        EasyInvoice
                    </Text>
                    <Text className="text-base text-text-light font-medium tracking-wide">
                        Professional Billing Made Simple
                    </Text>
                </View>

                {/* Form Card */}
                <View className="bg-card rounded-3xl p-8 border border-card-border shadow-md shadow-black/10">
                    <Text className="text-2xl font-bold text-text mb-2">Welcome Back</Text>
                    <Text className="text-base text-text-muted mb-8">Sign in to access your dashboard</Text>

                    {/* Email Input */}
                    <View className="mb-5">
                        <Text className="text-xs font-bold text-text-light mb-2 tracking-widest pl-1">
                            EMAIL
                        </Text>
                        <View className="flex-row items-center bg-background-light border border-card-border rounded-xl px-4 h-14 focus:border-primary">
                            <Feather name="mail" size={20} color="#64748B" style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-base text-text h-full"
                                placeholder="Enter your email"
                                placeholderTextColor="#64748B"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View className="mb-8">
                        <Text className="text-xs font-bold text-text-light mb-2 tracking-widest pl-1">
                            PASSWORD
                        </Text>
                        <View className="flex-row items-center bg-background-light border border-card-border rounded-xl px-4 h-14">
                            <Feather name="lock" size={20} color="#64748B" style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-base text-text h-full"
                                placeholder="Enter your password"
                                placeholderTextColor="#64748B"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        className="bg-primary rounded-xl h-14 flex-row justify-center items-center mt-2 shadow-lg shadow-primary/30"
                        onPress={handleLogin}
                        activeOpacity={0.8}
                        style={{ elevation: 4 }}
                    >
                        <Text className="text-white text-lg font-bold tracking-wide mr-2">
                            Sign In
                        </Text>
                        <Feather name="arrow-right" size={20} color="white" />
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-px bg-card-border" />
                        <Text className="text-text-muted px-4 text-xs font-semibold">OR</Text>
                        <View className="flex-1 h-px bg-card-border" />
                    </View>

                    {/* Register Link */}
                    <View className="flex-row justify-center">
                        <Text className="text-base text-text-light">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-base text-primary-light font-bold">
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
