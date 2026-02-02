// Create Bill Screen - NativeWind
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import ItemRow from '../components/ItemRow';
import LoadingSpinner from '../components/LoadingSpinner';
import { RootStackParamList, BillItemForm } from '../types';

type CreateBillScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateBill'>;

interface Props {
    navigation: CreateBillScreenNavigationProp;
}

const CreateBillScreen: React.FC<Props> = ({ navigation }) => {
    const { user } = useAuth();
    const [customerName, setCustomerName] = useState<string>('');
    const [customerPhone, setCustomerPhone] = useState<string>('');
    const [items, setItems] = useState<BillItemForm[]>([
        { itemName: '', quantity: '', price: '' },
    ]);
    const [loading, setLoading] = useState<boolean>(false);

    const grandTotal = items.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        return sum + qty * price;
    }, 0);

    const addItem = (): void => {
        setItems([...items, { itemName: '', quantity: '', price: '' }]);
    };

    const updateItem = (index: number, updatedItem: BillItemForm): void => {
        const newItems = [...items];
        newItems[index] = updatedItem;
        setItems(newItems);
    };

    const removeItem = (index: number): void => {
        if (items.length === 1) {
            Alert.alert('Error', 'Bill must have at least one item');
            return;
        }
        setItems(items.filter((_, i) => i !== index));
    };

    const saveBill = async (): Promise<void> => {
        if (!customerName.trim()) {
            Alert.alert('Error', 'Please enter customer name');
            return;
        }
        if (!customerPhone.trim()) {
            Alert.alert('Error', 'Please enter customer phone');
            return;
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.itemName.trim()) {
                Alert.alert('Error', `Please enter name for Item #${i + 1}`);
                return;
            }
            if (!item.quantity || parseFloat(item.quantity) <= 0) {
                Alert.alert('Error', `Please enter valid quantity for Item #${i + 1}`);
                return;
            }
            if (!item.price || parseFloat(item.price) <= 0) {
                Alert.alert('Error', `Please enter valid price for Item #${i + 1}`);
                return;
            }
        }

        if (!user) {
            Alert.alert('Error', 'You must be logged in to create a bill');
            return;
        }

        setLoading(true);

        try {
            const billData = {
                userId: user.uid,
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim(),
                totalAmount: grandTotal,
                date: serverTimestamp(),
            };

            const billRef = await addDoc(collection(db, 'bills'), billData);

            const itemsRef = collection(db, 'bills', billRef.id, 'items');
            for (const item of items) {
                const qty = parseFloat(item.quantity);
                const price = parseFloat(item.price);
                await addDoc(itemsRef, {
                    itemName: item.itemName.trim(),
                    quantity: qty,
                    price: price,
                    itemTotal: qty * price,
                });
            }

            Alert.alert('Success! 🎉', 'Invoice created successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            console.error('Error creating bill:', error);
            Alert.alert('Error', 'Failed to create invoice. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Creating invoice..." />;
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-card border border-card-border justify-center items-center mr-4"
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={20} color="#64748B" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-text">New Invoice</Text>
                </View>

                {/* Customer Section */}
                <View className="bg-card rounded-3xl p-6 mb-5 border border-card-border shadow-sm shadow-black/5">
                    <View className="flex-row items-center mb-5 pb-4 border-b border-card-border/50">
                        <View className="w-10 h-10 rounded-full bg-secondary/10 justify-center items-center mr-3">
                            <Feather name="user-plus" size={20} color="#10B981" />
                        </View>
                        <Text className="text-lg font-bold text-text">Customer Details</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-xs font-bold text-text-light mb-2 tracking-wider pl-1">
                            CUSTOMER NAME
                        </Text>
                        <View className="flex-row items-center bg-background-light border border-card-border rounded-xl px-4 h-14">
                            <Feather name="align-left" size={20} color="#64748B" style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-base text-text h-full"
                                placeholder="Enter customer name"
                                placeholderTextColor="#64748B"
                                value={customerName}
                                onChangeText={setCustomerName}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-xs font-bold text-text-light mb-2 tracking-wider pl-1">
                            PHONE NUMBER
                        </Text>
                        <View className="flex-row items-center bg-background-light border border-card-border rounded-xl px-4 h-14">
                            <Feather name="phone" size={20} color="#64748B" style={{ marginRight: 12 }} />
                            <TextInput
                                className="flex-1 text-base text-text h-full"
                                placeholder="Enter phone number"
                                placeholderTextColor="#64748B"
                                value={customerPhone}
                                onChangeText={setCustomerPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                </View>

                {/* Items Section */}
                <View className="bg-card rounded-3xl p-6 mb-5 border border-card-border shadow-sm shadow-black/5">
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-primary/10 justify-center items-center mr-3">
                                <Feather name="package" size={20} color="#6366F1" />
                            </View>
                            <Text className="text-lg font-bold text-text">Items</Text>
                        </View>
                        <TouchableOpacity
                            onPress={addItem}
                            className="bg-secondary px-4 py-2.5 rounded-xl shadow-md shadow-secondary/30 flex-row items-center"
                        >
                            <Feather name="plus" size={16} color="white" style={{ marginRight: 4 }} />
                            <Text className="text-white text-sm font-bold">Add Item</Text>
                        </TouchableOpacity>
                    </View>

                    {items.map((item, index) => (
                        <ItemRow
                            key={index}
                            item={item}
                            index={index}
                            onUpdate={updateItem}
                            onRemove={removeItem}
                        />
                    ))}
                </View>

                {/* Total Section */}
                <View className="bg-primary rounded-3xl p-6 mb-6 shadow-lg shadow-primary/40">
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-sm font-semibold text-white/80 mb-1">Grand Total</Text>
                            <Text className="text-xs text-white/60">Includes all items</Text>
                        </View>
                        <Text className="text-4xl font-bold text-white">
                            ${grandTotal.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Create Button */}
                <TouchableOpacity
                    className="bg-secondary rounded-2xl h-14 flex-row justify-center items-center mb-6 shadow-lg shadow-secondary/40"
                    onPress={saveBill}
                    activeOpacity={0.8}
                >
                    <Feather name="check" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white text-lg font-bold tracking-wide">
                        Create Invoice
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CreateBillScreen;
