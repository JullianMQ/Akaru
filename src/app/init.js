// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDtjWDwi1pqAXaQMeVo1HLBzW7eCg1-Jsc",
  authDomain: "demoapp-3fdb1.firebaseapp.com",
  projectId: "demoapp-3fdb1",
  storageBucket: "demoapp-3fdb1.appspot.com",
  messagingSenderId: "142443473603",
  appId: "1:142443473603:web:fa1d94cb9913bde2c35076"
};

// Firebase stuff
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Monitoring Auth State
const checkAuthState = () => {
    return new Promise((res, rej) => {
        onAuthStateChanged(auth, user => {
            if (user) {
                res(user);
            } else {
                res("false");
            }
        });
    })
};

const getUser = async () => {
    const isUser = await checkAuthState();
    return isUser;
}

const isUser = await getUser();

export { app, auth, db, storage, isUser, checkAuthState };
