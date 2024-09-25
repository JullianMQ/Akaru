import { auth, db, checkAuthState } from "./init.js"
import {} from "firebase/firestore";
import {} from "firebase/storage";
import { signOut } from "firebase/auth";

// DOM VARIABLES
const logOutBtn = document.querySelector("#logOutBtn");

window.onload = console.log(checkAuthState());
// window.onload = 

// const borrowBook = async () => {
//     const user = checkAuthState();
//     console.log(user);
// }

// TODO: MOVE TO INDEX HTML
// Log Out Start
const userLogOut = async () => {
    console.log("Log Out")
    signOut(auth)
        .then(() => {
            alert("Signed Out!")
        })
        .catch((error) => {
            console.log(error);
        });
}

logOutBtn.addEventListener("click", () => {
    userLogOut();
    // console.log(db);
});
// Log Out End
