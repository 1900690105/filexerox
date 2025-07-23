import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3aS-7twBFch6Dbu_Frkk-vWDghunt-A0",
  authDomain: "filexerox-f6623.firebaseapp.com",
  projectId: "filexerox-f6623",
  storageBucket: "filexerox-f6623.firebasestorage.app",
  messagingSenderId: "723025570382",
  appId: "1:723025570382:web:9f43c2b725dfa25bb0311f",
  measurementId: "G-8EWW7V7Q00",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
