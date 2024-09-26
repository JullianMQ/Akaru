// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB0CO9PloCBIieVifCPi5ptBibNTRj4fZk",
  authDomain: "test-lms-addbase.firebaseapp.com",
  projectId: "test-lms-addbase",
  storageBucket: "test-lms-addbase.appspot.com",
  messagingSenderId: "770512950395",
  appId: "1:770512950395:web:9ad0a7fe3caadb35c53ede",
  measurementId: "G-WC1HFBNBDH"
};

// Firebase stuff
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Monitoring Auth State
const checkAuthState = () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            // console.log("You are logged in!");
            return true;
        } else {
            // console.log("You are logged out!");
            return false;
        }
    });
};

export { app, auth, db, storage, checkAuthState };
