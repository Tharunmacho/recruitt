import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDILPxexEifVI-UVv1q1KsgTnSPqKZLy9s",
  authDomain: "ml-adira.firebaseapp.com",
  projectId: "ml-adira",
  storageBucket: "ml-adira.firebasestorage.app",
  messagingSenderId: "515387660982",
  appId: "1:515387660982:web:47f03ca553bf19c26d6417",
  measurementId: "G-HZJ9DS0MTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (Database) - Strictly connecting to the 'portal' database!
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, "portal");
