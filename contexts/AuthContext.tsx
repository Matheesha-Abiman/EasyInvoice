// Authentication Context for managing user state
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { AuthContextType, AuthResult, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    // Register new user (signs out after to redirect to login)
    const register = async (email: string, password: string): Promise<AuthResult> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Sign out immediately so user goes to login page
            await signOut(auth);
            return {
                success: true,
                user: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                }
            };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    // Login existing user
    const login = async (email: string, password: string): Promise<AuthResult> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return {
                success: true,
                user: {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                }
            };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    // Logout user
    const logout = async (): Promise<AuthResult> => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
