// Loading Spinner Component - NativeWind
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    message = 'Loading...'
}) => {
    return (
        <View className="flex-1 justify-center items-center bg-background">
            <View className="bg-card rounded-3xl p-8 items-center border border-card-border shadow-lg shadow-primary/20">
                <ActivityIndicator size={size} color="#6366F1" />
                <Text className="mt-4 text-base text-text-light font-medium">
                    {message}
                </Text>
            </View>
        </View>
    );
};

export default LoadingSpinner;
