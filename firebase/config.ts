// Firebase configuration for EasyInvoice app
import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyASzdf0NoBcz5U5z8tJwNdztshtnW1GeUU",
    authDomain: "task-app-29867.firebaseapp.com",
    projectId: "task-app-29867",
    storageBucket: "task-app-29867.firebasestorage.app",
    messagingSenderId: "345226300722",
    appId: "1:345226300722:web:e719872fbfa9704a6c1b2b"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth: Auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db: Firestore = getFirestore(app);

export { auth, db };
