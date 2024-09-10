// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyCSOjiTqbAd4g2rLn8cIyMHbdKSjgNvIhk",
    authDomain: "firstdemo-c1177.firebaseapp.com",
    projectId: "firstdemo-c1177",
    storageBucket: "firstdemo-c1177.appspot.com",
    messagingSenderId: "344621487288",
    appId: "1:344621487288:web:d040d43c33d3e26be5104d",
    measurementId: "G-B38YCVL1SP"
};

// Firebase stuff
const app = initializeApp(firebaseConfig);

export { app };
