// Bill Details Screen - NativeWind with PDF Export
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    StatusBar,
} from 'react-native';
import {
    doc,
    deleteDoc,
    collection,
    getDocs,
    onSnapshot,
    Unsubscribe,
    Timestamp,
} from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { db } from '../firebase/config';
import LoadingSpinner from '../components/LoadingSpinner';
import { RootStackParamList, Bill, BillItem } from '../types';
import { Feather } from '@expo/vector-icons';

type BillDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BillDetails'>;
type BillDetailsScreenRouteProp = RouteProp<RootStackParamList, 'BillDetails'>;

interface Props {
    navigation: BillDetailsScreenNavigationProp;
    route: BillDetailsScreenRouteProp;
}

const BillDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    const { billId } = route.params;
    const [bill, setBill] = useState<Bill | null>(null);
    const [items, setItems] = useState<BillItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [generatingPdf, setGeneratingPdf] = useState<boolean>(false);

    useEffect(() => {
        const billRef = doc(db, 'bills', billId);
        const unsubscribeBill: Unsubscribe = onSnapshot(
            billRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setBill({ id: docSnap.id, ...docSnap.data() } as Bill);
                } else {
                    Alert.alert('Error', 'Bill not found');
                    navigation.goBack();
                }
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching bill:', error);
                Alert.alert('Error', 'Failed to load bill details');
                setLoading(false);
            }
        );

        const fetchItems = async () => {
            try {
                const itemsRef = collection(db, 'bills', billId, 'items');
                const itemsSnap = await getDocs(itemsRef);
                const itemsData: BillItem[] = itemsSnap.docs.map((doc) => ({
                    id: doc.id,
                    itemName: doc.data().itemName,
                    quantity: doc.data().quantity,
                    price: doc.data().price,
                    itemTotal: doc.data().itemTotal,
                }));
                setItems(itemsData);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
        return () => unsubscribeBill();
    }, [billId, navigation]);

    const formatDate = (timestamp: Timestamp | Date | undefined): string => {
        if (!timestamp) return 'N/A';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const generatePDF = async () => {
        if (!bill) return;

        setGeneratingPdf(true);
        try {
            const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
{{ ... }}
          </div>
        </body>
        </html>
      `;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (error) {
            console.error('PDF Generation Error:', error);
            Alert.alert('Error', 'Failed to generate PDF invoice');
        } finally {
            setGeneratingPdf(false);
        }
    };

    const handleDelete = (): void => {
        Alert.alert(
            'Delete Invoice',
            'Are you sure you want to delete this invoice? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: deleteBill },
            ]
        );
    };

    const deleteBill = async (): Promise<void> => {
        setDeleting(true);
        try {
            const itemsRef = collection(db, 'bills', billId, 'items');
            const itemsSnap = await getDocs(itemsRef);
            const deletePromises = itemsSnap.docs.map((itemDoc) =>
                deleteDoc(doc(db, 'bills', billId, 'items', itemDoc.id))
            );
            await Promise.all(deletePromises);
            await deleteDoc(doc(db, 'bills', billId));

            Alert.alert('Success', 'Invoice deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            console.error('Error deleting bill:', error);
            Alert.alert('Error', 'Failed to delete invoice');
        } finally {
            setDeleting(false);
        }
    };

    if (loading || deleting || generatingPdf) {
        return <LoadingSpinner message={
            deleting ? 'Deleting...' :
                generatingPdf ? 'Generating PDF...' :
                    'Loading...'
        } />;
    }

    if (!bill) return null;

    return (
        <ScrollView className="flex-1 bg-background">
            <StatusBar barStyle="light-content" />

            {/* Back Button */}
            <TouchableOpacity
                className="absolute top-12 left-5 z-10 w-10 h-10 rounded-full bg-white/20 justify-center items-center"
                onPress={() => navigation.goBack()}
            >
                <Feather name="arrow-left" size={20} color="white" />
            </TouchableOpacity>

            {/* Header Card */}
            <View className="bg-primary m-4 rounded-[32px] p-6 items-center shadow-lg shadow-primary/40 pt-16">
                <View className="bg-white/20 px-4 py-1.5 rounded-full mb-3 flex-row items-center">
                    <Feather name="check-circle" size={12} color="white" style={{ marginRight: 6 }} />
                    <Text className="text-xs font-bold text-white tracking-widest">PAID INVOICE</Text>
                </View>
                <Text className="text-sm text-white/80 mb-6">{formatDate(bill.date)}</Text>
                <View className="items-center mb-4">
                    <Text className="text-sm text-white/70 mb-1 font-medium tracking-wide">TOTAL AMOUNT</Text>
                    <Text className="text-5xl font-bold text-white">
                        ${(bill.totalAmount || 0).toFixed(2)}
                    </Text>
                </View>

                {/* Share PDF Button */}
                <TouchableOpacity
                    className="bg-white rounded-2xl py-3 px-6 flex-row items-center shadow-lg shadow-black/20"
                    onPress={generatePDF}
                    activeOpacity={0.8}
                >
                    <Feather name="share" size={20} color="#6366F1" style={{ marginRight: 8 }} />
                    <Text className="text-primary text-base font-bold">Share PDF</Text>
                </TouchableOpacity>
            </View>

            {/* Customer Section */}
            <View className="bg-card mx-5 mb-5 rounded-3xl p-6 border border-card-border shadow-sm shadow-black/5">
                <View className="flex-row items-center mb-5 pb-4 border-b border-card-border/50">
                    <View className="w-10 h-10 rounded-full bg-secondary/10 justify-center items-center mr-3">
                        <Feather name="user" size={20} color="#10B981" />
                    </View>
                    <Text className="text-lg font-bold text-text">Customer Details</Text>
                </View>

                <View className="mb-4 flex-row items-center">
                    <Feather name="align-left" size={18} color="#94A3B8" style={{ marginRight: 12 }} />
                    <View>
                        <Text className="text-xs font-bold text-text-muted tracking-wide mb-0.5">NAME</Text>
                        <Text className="text-lg text-text font-semibold">{bill.customerName}</Text>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <Feather name="phone" size={18} color="#94A3B8" style={{ marginRight: 12 }} />
                    <View>
                        <Text className="text-xs font-bold text-text-muted tracking-wide mb-0.5">PHONE</Text>
                        <Text className="text-lg text-text font-semibold">{bill.customerPhone}</Text>
                    </View>
                </View>
            </View>

            {/* Items Section */}
            <View className="bg-card mx-5 mb-5 rounded-3xl p-6 border border-card-border shadow-sm shadow-black/5">
                <View className="flex-row items-center mb-5 pb-4 border-b border-card-border/50">
                    <View className="w-10 h-10 rounded-full bg-primary/10 justify-center items-center mr-3">
                        <Feather name="package" size={20} color="#6366F1" />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-text">Purchased Items</Text>
                        <Text className="text-xs text-text-muted">{items.length} items total</Text>
                    </View>
                </View>

                {items.map((item, index) => (
                    <View
                        key={item.id || index}
                        className="bg-background-light rounded-2xl p-4 mb-3 border border-card-border"
                    >
                        <View className="flex-row items-center mb-3">
                            <View className="bg-primary/10 px-2.5 py-1 rounded-lg mr-3">
                                <Text className="text-xs font-bold text-primary">#{index + 1}</Text>
                            </View>
                            <Text className="text-base font-semibold text-text flex-1" numberOfLines={2}>
                                {item.itemName}
                            </Text>
                        </View>

                        <View className="flex-row justify-between pt-2 border-t border-card-border/50">
                            <View className="items-center flex-1 border-r border-card-border/50">
                                <Text className="text-[10px] text-text-muted font-bold tracking-wider mb-0.5">QTY</Text>
                                <Text className="text-base text-text-light font-semibold">{item.quantity}</Text>
                            </View>
                            <View className="items-center flex-1 border-r border-card-border/50">
                                <Text className="text-[10px] text-text-muted font-bold tracking-wider mb-0.5">PRICE</Text>
                                <Text className="text-base text-text-light font-semibold">
                                    ${(item.price || 0).toFixed(2)}
                                </Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-[10px] text-text-muted font-bold tracking-wider mb-0.5">TOTAL</Text>
                                <Text className="text-lg font-bold text-secondary">
                                    ${(item.itemTotal || 0).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Action Buttons */}
            <View className="flex-row px-5 pb-10 gap-4">
                <TouchableOpacity
                    className="flex-1 flex-row bg-card border border-secondary rounded-2xl py-4 items-center justify-center"
                    onPress={() => navigation.navigate('EditBill', { billId })}
                    activeOpacity={0.7}
                >
                    <Feather name="edit-2" size={20} color="#10B981" style={{ marginRight: 8 }} />
                    <Text className="text-secondary text-base font-bold">Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-1 flex-row bg-card border border-error rounded-2xl py-4 items-center justify-center"
                    onPress={handleDelete}
                    activeOpacity={0.7}
                >
                    <Feather name="trash-2" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text className="text-error text-base font-bold">Delete</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default BillDetailsScreen;
