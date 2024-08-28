// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3CbvQlvlL8uVmLZli8I7mXUf_ztsVj9A",
    authDomain: "quickstart-auth-firebase.firebaseapp.com",
    projectId: "quickstart-auth-firebase",
    storageBucket: "quickstart-auth-firebase.appspot.com",
    messagingSenderId: "572823911783",
    appId: "1:572823911783:web:546ba25c7323df024903c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
