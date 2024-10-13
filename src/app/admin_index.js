import {
    doc,
    getDoc
} from "firebase/firestore";
import { isUser, db } from "./init.js"

const logOutBtn = document.querySelector("#logOutBtn");
const userName = document.querySelector("#userName");
const isAdminElement = document.querySelector("[data-is-admin]");

// Uncomment after adding styles FRONTEND
// const getUserRole = async () => {
//     const userDocRef = doc(db, "users", isUser.uid);
//     const userDoc = await getDoc(userDocRef);
//     const userRole = userDoc.data().userRole;
//     return userRole;
// }

// const isAdmin = () => {
//     if (isUser !== false) {
//         const userRole = getUserRole();
//         if (userRole !== "Admin") {
//             userName.textContent = isUser.displayName;
//             isAdminElement.style.display = "block";
//             return 0;
//         }
//     }
//     window.location.href = "index1.html";
//     return 1;
// }

// Uncomment after adding styles FRONTEND
// window.onload = isAdmin();
