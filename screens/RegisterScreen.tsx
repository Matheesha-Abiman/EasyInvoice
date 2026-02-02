// Register Screen - NativeWind
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

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
    navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { register } = useAuth();

    const handleRegister = async (): Promise<void> => {
        if (!email.trim() || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await register(email.trim(), password);
        setLoading(false);

        if (result.success) {
            Alert.alert('Success', 'Account created successfully! Please login.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
            ]);
        } else {
            Alert.alert('Registration Failed', result.error);
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
                <View className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-secondary/10 blur-3xl opacity-50" />
                <View className="absolute top-1/2 -right-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl opacity-50" />

                {/* Back Button */}
                <TouchableOpacity
                    className="absolute top-12 left-0 z-10 w-10 h-10 rounded-full bg-card border border-card-border justify-center items-center ml-2"
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="arrow-left" size={20} color="#64748B" />
                </TouchableOpacity>

                {/* Header */}
                <View className="items-center mb-8 mt-16">
                    <View className="w-16 h-16 rounded-2xl bg-secondary justify-center items-center mb-4 shadow-lg shadow-secondary/30 -rotate-6">
                        <Feather name="user-plus" size={30} color="white" />
                    </View>
                    <Text className="text-3xl font-bold text-text mb-1 tracking-tight">Create Account</Text>
                    <Text className="text-base text-text-light font-medium">Join EasyInvoice today</Text>
                </View>

                {/* Form Card */}
                <View className="bg-card rounded-3xl p-8 border border-card-border shadow-md shadow-black/10">

                    {/* Email Input */}
                    <View className="mb-5">
                        <Text className="text-xs font-bold text-text-light mb-2 tracking-widest pl-1">
                            EMAIL
                        </Text>
                        <View className="flex-row items-center bg-background-light border border-card-border rounded-xl px-4 h-14">
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
                    <View className="mb-5">
                        <Text className="text-xs font-bold text-text-light mb-2 tracking-widest pl-1">
                            PASSWORD
                        </Text>
                        <View className="flex-row items-center bg-background-light border border-card-border rounded-xl px-4 h-14">
                            <Feather name="lock" size={20} color="#64748B" style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-base text-text h-full"
                                placeholder="Create a password"
                                placeholderTextColor="#64748B"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password Input */}
                    <View className="mb-8">
                        <Text className="text-xs font-bold text-text-light mb-2 tracking-widest pl-1">
                            CONFIRM PASSWORD
                        </Text>
                        <View className="flex-row items-center bg-background-light border border-card-border rounded-xl px-4 h-14">
                            <Feather name="check-circle" size={20} color="#64748B" style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-base text-text h-full"
                                placeholder="Confirm your password"
                                placeholderTextColor="#64748B"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        className="bg-secondary rounded-xl h-14 flex-row justify-center items-center mt-2 shadow-lg shadow-secondary/30"
                        onPress={handleRegister}
                        activeOpacity={0.8}
                        style={{ elevation: 4 }}
                    >
                        <Text className="text-white text-lg font-bold tracking-wide mr-2">
                            Sign Up
                        </Text>
                        <Feather name="chevrons-right" size={20} color="white" />
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-px bg-card-border" />
                        <Text className="text-text-muted px-4 text-xs font-semibold">ALREADY JOINED?</Text>
                        <View className="flex-1 h-px bg-card-border" />
                    </View>

                    {/* Login Link */}
                    <View className="flex-row justify-center">
                        <Text className="text-base text-text-light">Have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text className="text-base text-secondary font-bold">
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;
