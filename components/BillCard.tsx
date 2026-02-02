// Bill Card Component - NativeWind
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bill } from '../types';
import { Timestamp } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';

interface BillCardProps {
    bill: Bill;
    onPress: () => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onPress }) => {
    const formatDate = (timestamp: Timestamp | Date | undefined): string => {
        if (!timestamp) return 'N/A';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number | undefined): string => {
        return `$${(amount || 0).toFixed(2)}`;
    };

    return (
        <TouchableOpacity
            className="bg-card rounded-2xl mx-5 my-2 flex-row overflow-hidden border border-card-border shadow-sm shadow-black/10"
            onPress={onPress}
            activeOpacity={0.7}
            style={{ elevation: 2 }}
        >
            {/* Left Accent */}
            <View className="w-1.5 bg-primary" />

            {/* Content */}
            <View className="flex-1 p-4">
                {/* Header Row */}
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center flex-1 mr-3">
                        {/* Avatar */}
                        <View className="w-10 h-10 rounded-full bg-primary/10 justify-center items-center mr-3 border border-primary/20">
                            <Text className="text-lg font-bold text-primary">
                                {(bill.customerName || 'U').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        {/* Name & Phone */}
                        <View className="flex-1">
                            <Text className="text-base font-bold text-text mb-0.5" numberOfLines={1}>
                                {bill.customerName || 'Unknown Customer'}
                            </Text>
                            <View className="flex-row items-center">
                                <Feather name="phone" size={10} color="#64748B" style={{ marginRight: 4 }} />
                                <Text className="text-xs text-text-muted" numberOfLines={1}>
                                    {bill.customerPhone || 'No phone'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* Amount Badge */}
                    <View className="bg-background-light px-3 py-1.5 rounded-lg border border-card-border">
                        <Text className="text-base font-bold text-primary">
                            {formatCurrency(bill.totalAmount)}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View className="flex-row justify-between items-center pt-3 border-t border-card-border/50">
                    <View className="flex-row items-center">
                        <Feather name="calendar" size={12} color="#94A3B8" style={{ marginRight: 6 }} />
                        <Text className="text-xs text-text-light font-medium">
                            {formatDate(bill.date)}
                        </Text>
                    </View>
                    <Feather name="chevron-right" size={16} color="#475569" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default BillCard;
