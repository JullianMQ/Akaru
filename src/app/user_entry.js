import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import {
    doc,
    setDoc,
} from "firebase/firestore";
import { isUser, auth, db, checkAuthState } from "./init.js";

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

// Check if user is already logged in
// End Check if user is already logged in

// Sign Up Start
// Get Credentials Auth Firebase
const signUp = async (auth, userEmail, userPass) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPass);
        const user = userCredential.user;

        await updateProfile(auth.currentUser, {
            displayName: userName.value,
        });

        // userEmail/Pass is already set in the parent function so no need to use .value
        // This will return into undefined if you do
        await addToUserCollection(user.uid, userName.value, userPhone.value, userEmail);
        alert("Successfully signed up. Please log in now.")

    } catch (error) {
        console.error(`Error code: ${error.code}`)
        console.error(`Error message: ${error.message}`)
    }
};

// Get Personal Details Firestore Firebase
const addToUserCollection = async (uid, username, phone, email) => {
    try {
        const docRef = doc(db, "users", uid);
        await setDoc(docRef, {
            userName: username,
            phone: phone,
            email: email,
            userRole: "User",
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
    try {
        const loggedInCredential = await signInWithEmailAndPassword(auth, email, password);
        // redirect back to index page
        checkAuthState();
        alert("You have signed in!");
        window.location.href = "index.html";
    } catch (error) {
        if (error.code === "auth/invalid-credential") {
            alert("No user with that account or wrong password");
        }
        if (error.code === "auth/invalid-email") {
            alert("Incorrect email");
        }
    }
};

logInBtn.addEventListener("click", () => {
    logIn(auth, logInEmail.value, logInPass.value);
});
// Log In End

window.onload = checkAuthState();

if (isUser !== "false") {
    window.location.href = "index.html";
} else {
    console.log("Not logged in");
}
// export { user };
