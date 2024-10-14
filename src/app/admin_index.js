import {
    doc,
    getDoc
} from "firebase/firestore";
import { isUser, db } from "./init.js"

const logOutBtn = document.querySelector("#logOutBtn");
const userName = document.querySelector("#userName");
const isAdminElement = document.querySelector("[data-is-admin]");

// Uncomment after adding styles FRONTEND
const getUserRole = async () => {
    const userDocRef = doc(db, "users", isUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userRole = userDoc.data().userRole;
    return userRole;
}

const isAdmin = () => {
    if (isUser !== false) {
        const userRole = getUserRole();
        if (userRole !== "Admin") {
            userName.textContent = isUser.displayName;
            isAdminElement.style.display = "flex";
            return 0;
        }
    }
    window.location.href = "index1.html";
    return 1;
}

// Log Out Start
const userLogOut = async () => {
    if (isUser !== "false") {
        try {
            await signOut(auth);
            alert("Signed Out!");
            // full reload to not read from cache
            window.location.reload(true);
            return 0;
        } catch (error) {
            alert("Something went wrong: Please check the logs if you are an advanced user.");
            console.log(error.message);
            return 0;
        }
    }
    window.location.href = "entry_page.html";
    return 0;
};
logOutBtn.addEventListener("click", () => {
    userLogOut();
    checkAuthState();
});
// Log Out End

// FrontEnd Stuff
var hamburger = document.getElementById('hamburger');
var trigger = document.getElementById('header');

hamburger.onclick = function () {
    hamburger.classList.toggle('open');
    trigger.classList.toggle('open');
    document.body.classList.toggle('menu-open');
}
// End FrontEnd Stuff

// Uncomment after adding styles FRONTEND
window.onload = isAdmin();
