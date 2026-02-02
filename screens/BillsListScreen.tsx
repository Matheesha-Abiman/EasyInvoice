// Bills List Screen - NativeWind with Real-time
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    StatusBar,
    RefreshControl,
    Platform,
} from 'react-native';
import {
    collection,
    query,
    where,
    onSnapshot,
    Unsubscribe,
    QuerySnapshot,
    DocumentData,
    Timestamp,
} from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import BillCard from '../components/BillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { RootStackParamList, Bill } from '../types';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type BillsListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BillsList'>;

interface Props {
    navigation: BillsListScreenNavigationProp;
}

const BillsListScreen: React.FC<Props> = ({ navigation }) => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { user, logout } = useAuth();

    // Real-time listener
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const billsRef = collection(db, 'bills');
        const q = query(billsRef, where('userId', '==', user.uid));

        const unsubscribe: Unsubscribe = onSnapshot(
            q,
            (snapshot: QuerySnapshot<DocumentData>) => {
                const billsData: Bill[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    userId: doc.data().userId,
                    customerName: doc.data().customerName,
                    customerPhone: doc.data().customerPhone,
                    totalAmount: doc.data().totalAmount,
                    date: doc.data().date,
                }));

                // Sort by date client-side
                billsData.sort((a, b) => {
                    const getTime = (date: Timestamp | Date | undefined): number => {
                        if (!date) return 0;
                        if (date instanceof Timestamp) return date.toDate().getTime();
                        if (date instanceof Date) return date.getTime();
                        return 0;
                    };
                    return getTime(b.date) - getTime(a.date);
                });

                setBills(billsData);
                setLoading(false);
                setRefreshing(false);
            },
            (error) => {
                console.error('Error fetching bills:', error);
                Alert.alert('Error', 'Failed to load bills. Please try again.');
                setLoading(false);
                setRefreshing(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const handleLogout = (): void => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    const result = await logout();
                    if (!result.success) Alert.alert('Error', result.error);
                },
            },
        ]);
    };

    const totalAmount = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);

    const renderBill = ({ item }: { item: Bill }) => (
        <BillCard
            bill={item}
            onPress={() => navigation.navigate('BillDetails', { billId: item.id })}
        />
    );

    const renderEmpty = () => (
        <View className="flex-1 justify-center items-center p-8 mt-10">
            <View className="w-24 h-24 rounded-full bg-card border border-card-border justify-center items-center mb-6 shadow-sm">
                <Feather name="clipboard" size={40} color="#64748B" />
            </View>
            <Text className="text-2xl font-bold text-text mb-2">No Bills Yet</Text>
            <Text className="text-base text-text-muted text-center mb-8 px-4">
                Create your first invoice to get started tracking your sales.
            </Text>
            <TouchableOpacity
                className="bg-primary flex-row items-center px-8 py-4 rounded-full shadow-lg shadow-primary/30"
                onPress={() => navigation.navigate('CreateBill')}
                activeOpacity={0.8}
            >
                <Feather name="plus-circle" size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white text-base font-bold">Create First Bill</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <View className="flex-1 bg-background">
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="px-6 pt-2 pb-6">
                    <View className="flex-row justify-between items-center mb-8">
                        <View>
                            <Text className="text-3xl font-bold text-text tracking-tight">Dashboard</Text>
                            <Text className="text-base text-text-muted mt-1 font-medium">Overview</Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="w-10 h-10 rounded-full bg-card/50 border border-card-border/50 justify-center items-center"
                        >
                            <Feather name="log-out" size={20} color="#F87171" style={{ marginLeft: 2 }} />
                        </TouchableOpacity>
                    </View>

                    {/* Stats Cards */}
                    <View className="flex-row gap-4">
                        <View className="flex-1 rounded-3xl p-5 bg-gradient-to-br from-primary to-primary-dark shadow-xl shadow-primary/20 bg-primary">
                            <View className="w-10 h-10 rounded-2xl bg-white/20 justify-center items-center mb-4">
                                <Feather name="file-text" size={20} color="white" />
                            </View>
                            <Text className="text-3xl font-bold text-white mb-1">{bills.length}</Text>
                            <Text className="text-sm text-white/70 font-medium">Total Invoices</Text>
                        </View>
                        <View className="flex-1 rounded-3xl p-5 bg-card border border-card-border shadow-md shadow-black/5">
                            <View className="w-10 h-10 rounded-2xl bg-secondary/10 justify-center items-center mb-4">
                                <Feather name="dollar-sign" size={20} color="#10B981" />
                            </View>
                            <Text className="text-3xl font-bold text-text mb-1">${totalAmount.toFixed(0)}</Text>
                            <Text className="text-text-muted text-sm font-medium">Total Revenue</Text>
                        </View>
                    </View>
                </View>

                {/* Bills Section */}
                <View className="flex-1 bg-background-light rounded-t-[40px] pt-8 px-2 overflow-hidden">
                    <View className="flex-row justify-between items-center px-6 mb-4">
                        <Text className="text-lg font-bold text-text">Recent Invoices</Text>
                        <TouchableOpacity onPress={() => { }}>
                            <Text className="text-primary text-sm font-semibold">View All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={bills}
                        renderItem={renderBill}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={renderEmpty}
                        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 4 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#6366F1"
                                colors={['#6366F1']}
                            />
                        }
                    />
                </View>
            </SafeAreaView>

            {/* FAB */}
            <TouchableOpacity
                className="absolute right-6 bottom-10 w-16 h-16 rounded-full bg-primary justify-center items-center shadow-xl shadow-primary/40"
                onPress={() => navigation.navigate('CreateBill')}
                activeOpacity={0.8}
                style={{ elevation: 8 }}
            >
                <Feather name="plus" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default BillsListScreen;
