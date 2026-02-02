// Type definitions for EasyInvoice app

import { Timestamp } from 'firebase/firestore';

// User type from Firebase Auth
export interface User {
    uid: string;
    email: string | null;
}

// Bill type
export interface Bill {
    id: string;
    userId: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    date: Timestamp | Date;
    updatedAt?: Timestamp | Date;
}

// Bill Item type
export interface BillItem {
    id?: string;
    itemName: string;
    quantity: number;
    price: number;
    itemTotal: number;
}

// For form state (quantities and prices as strings)
export interface BillItemForm {
    id?: string;
    itemName: string;
    quantity: string;
    price: string;
}

// Auth Context type
export interface AuthContextType {
    user: User | null;
    loading: boolean;
    register: (email: string, password: string) => Promise<AuthResult>;
    login: (email: string, password: string) => Promise<AuthResult>;
    logout: () => Promise<AuthResult>;
}

// Auth Result type
export interface AuthResult {
    success: boolean;
    user?: User;
    error?: string;
}

// Navigation types
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    BillsList: undefined;
    CreateBill: undefined;
    BillDetails: { billId: string };
    EditBill: { billId: string };
};
