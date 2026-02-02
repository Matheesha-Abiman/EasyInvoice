// Item Row Component - NativeWind
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BillItemForm } from '../types';

interface ItemRowProps {
    item: BillItemForm;
    index: number;
    onUpdate: (index: number, item: BillItemForm) => void;
    onRemove: (index: number) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, index, onUpdate, onRemove }) => {
    const itemTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);

    const handleChange = (field: keyof BillItemForm, value: string): void => {
        onUpdate(index, { ...item, [field]: value });
    };

    return (
        <View className="bg-background-light rounded-2xl p-4 mb-4 border border-card-border shadow-sm shadow-black/5">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <View className="bg-primary px-3.5 py-1.5 rounded-xl flex-row items-center">
                    <Feather name="tag" size={12} color="white" style={{ marginRight: 6 }} />
                    <Text className="text-sm font-bold text-white">Item #{index + 1}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => onRemove(index)}
                    className="w-8 h-8 rounded-xl bg-error/10 justify-center items-center border border-error/30"
                >
                    <Feather name="trash-2" size={16} color="#EF4444" />
                </TouchableOpacity>
            </View>

            {/* Item Name */}
            <View className="mb-3">
                <Text className="text-xs font-bold text-text-muted mb-1.5 tracking-wider pl-1">
                    ITEM NAME
                </Text>
                <View className="flex-row items-center bg-card border border-card-border rounded-xl px-3.5 h-12">
                    <Feather name="package" size={16} color="#94A3B8" style={{ marginRight: 10 }} />
                    <TextInput
                        className="flex-1 text-base text-text h-full"
                        placeholder="Enter item name"
                        placeholderTextColor="#64748B"
                        value={item.itemName}
                        onChangeText={(value) => handleChange('itemName', value)}
                    />
                </View>
            </View>

            {/* Quantity & Price Row */}
            <View className="flex-row gap-3 mb-3">
                <View className="flex-1">
                    <Text className="text-xs font-bold text-text-muted mb-1.5 tracking-wider pl-1">
                        QUANTITY
                    </Text>
                    <View className="flex-row items-center bg-card border border-card-border rounded-xl px-3.5 h-12">
                        <Feather name="layers" size={16} color="#94A3B8" style={{ marginRight: 10 }} />
                        <TextInput
                            className="flex-1 text-base text-text h-full"
                            placeholder="0"
                            placeholderTextColor="#64748B"
                            keyboardType="numeric"
                            value={item.quantity?.toString() || ''}
                            onChangeText={(value) => handleChange('quantity', value)}
                        />
                    </View>
                </View>
                <View className="flex-1">
                    <Text className="text-xs font-bold text-text-muted mb-1.5 tracking-wider pl-1">
                        PRICE ($)
                    </Text>
                    <View className="flex-row items-center bg-card border border-card-border rounded-xl px-3.5 h-12">
                        <Feather name="dollar-sign" size={16} color="#94A3B8" style={{ marginRight: 4 }} />
                        <TextInput
                            className="flex-1 text-base text-text h-full"
                            placeholder="0.00"
                            placeholderTextColor="#64748B"
                            keyboardType="decimal-pad"
                            value={item.price?.toString() || ''}
                            onChangeText={(value) => handleChange('price', value)}
                        />
                    </View>
                </View>
            </View>

            {/* Total Row */}
            <View className="flex-row justify-between items-center pt-3 border-t border-card-border/50">
                <Text className="text-sm font-semibold text-text-light">Item Total</Text>
                <View className="bg-secondary/15 px-4 py-2 rounded-xl border border-secondary/20">
                    <Text className="text-lg font-bold text-secondary">
                        ${itemTotal.toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default ItemRow;
