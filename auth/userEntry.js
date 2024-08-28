import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    getAdditionalUserInfo
} from "firebase/auth";
import { app } from "../public/init.js";

const auth = getAuth(app);
const user_email = document.querySelector('#email');
const user_pword = document.querySelector('#password');
const authForm = document.querySelector('#authForm');
const secretContent = document.querySelector('#secretContent');
const signOutButton = document.querySelector('#signOutButton');
const signInButton = document.querySelector('#signInButton');
const signUpButton = document.querySelector('#signUpButton');
const userSignUp = async () => {
    const signUpEmail = user_email.value;
    const signUpPword = user_pword.value;
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPword)
        .then((userCredential) => {
            const user = userCredential.user;
            // console.log(user);
            alert("Account Created")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMsg = error.message;
            console.log(`Error code ${errorCode}` + errorMsg);
        })
};

const userSignIn = async () => {
    const signInEmail = user_email.value;
    const signInPword = user_pword.value;
    signInWithEmailAndPassword(auth, signInEmail, signInPword)
        .then((userCredential) => {
            const user = userCredential.user;
            // console.log(user);
            // console.log(auth);
            document.querySelector("#greeting").innerText = `Hello ${user.email}`;
            alert("You have signed in!")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMsg = error.message;
            console.log(`Error code ${errorCode}` + errorMsg);
        })
};

const userSignOut = async () => {
    signOut(auth)
        .then(() => {
            alert("Signed Out!")
        })
        .catch((error) => {
            console.log(error);
        });
}

const checkAuthState = async () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            authForm.style.display = 'none';
            secretContent.style.display = 'block';
        } else {
            authForm.style.display = 'block';
            secretContent.style.display = 'none';
        }
    });
};

signUpButton.addEventListener('click', userSignUp);
signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut)
checkAuthState();


// Firestore stuff
import { collection, addDoc, getFirestore } from "firebase/firestore";
// Firestore initialization
const db = getFirestore(app);
const dataBtn = document.querySelector("#random_data");

const addRandomData = async () => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            first: "Chuchu",
            last: "Mataba",
            born: 1890
        });
        console.log("Document written: ", docRef.id);
    } catch (error) {
        console.error("Error adding doc: ", error);
    }
}

dataBtn.addEventListener("click", addRandomData);
