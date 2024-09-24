import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    getAuth,
    onAuthStateChanged,
    checkActionCode,
    updateProfile,
} from "firebase/auth";
import {
    doc,
    setDoc,
    collection,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    getFirestore
} from "firebase/firestore";
import { app } from "./init.js";


const auth = getAuth(app);
const db = getFirestore(app);

// Query from HTML
// Sign Up
const userName = document.querySelector("#userName");
const userPhone = document.querySelector("#userPhone");
const userEmail = document.querySelector("#userEmail");
const userPass = document.querySelector("#userPass");
const signUpBtn = document.querySelector("#signUpBtn");
// Log In
const logInBtn = document.querySelector("#logInBtn");
const logInEmail = document.querySelector("#logInEmail");
const logInPass = document.querySelector("#logInPass");
// Sign Out
const logOutBtn = document.querySelector("#logOutBtn");

// Sign Up Start
// Get Credentials Auth Firebase
const signUp = async (auth, userEmail, userPass) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPass);
        // console.log(userCredential);
        const user = userCredential.user;
        // console.log(user);


        await updateProfile(auth.currentUser, {
            displayName: userName.value,
        });

        // console.log(`User signed up with id: ${user.uid}!`);
        // console.log(`User signed up with username: ${userName.value}!`);

        // userEmail/Pass is already set in the parent function so no need to use .value
        // This will return into undefined if you do
        await addToUserCollection(user.uid, userName.value, userPhone.value, userEmail, userPass);

    } catch (error) {
        console.error(`Error code: ${error.code}`)
        console.error(`Error message: ${error.message}`)
    }
};

// Get Personal Details Firestore Firebase
const addToUserCollection = async (uid, username, phone, email, password) => {
    try {
        const docRef = doc(db, "users", uid);
        await setDoc(docRef, {
            userName: username,
            phone: phone,
            email: email,
            password: password,
        });
        // console.log(`Added to document with ID: ${docRef.id}!`);

    } catch (error) {
        console.error(`Error adding document: ${error.message}`);
    }
};

signUpBtn.addEventListener("click", () => {
    signUp(auth, userEmail.value, userPass.value);
});
// Sign Up End


// Log In Start

const logIn = async (auth, email, password) => {
    // console.log("Log In")
    try {
        const loggedInCredential = await signInWithEmailAndPassword(auth, email, password);
        // console.log(loggedInCredential);
        // console.log(loggedInCredential.user);
        alert("You have signed in!");
    } catch (error) {
        console.error(`Error code: ${error.code}`)
        console.error(`Error message: ${error.message}`)
    }
};

logInBtn.addEventListener("click", () => {
    logIn(auth, logInEmail.value, logInPass.value);
});

// Log In End

// TODO: MOVE TO INDEX HTML
// Log Out Start
// const userLogOut = async () => {
//     console.log("Log Out")
//     signOut(auth)
//         .then(() => {
//             alert("Signed Out!")
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }

// logOutBtn.addEventListener("click", () => {
//     userLogOut();
// });
// Log Out End

// Monitoring Auth State
const checkAuthState = async () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            console.log("You are logged in!");
        } else {
            console.log("You are logged out!");
        }
    });
};
checkAuthState();

// export { checkAuthState };
