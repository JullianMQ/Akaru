// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

export { app };
