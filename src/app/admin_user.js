import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    deleteUser,
} from "firebase/auth";
import {
    doc,
    collection,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    getFirestore
} from "firebase/firestore";
import { app } from "./init.js";

//variables na ginamit for the id
const auth = getAuth(app);
const db = getFirestore(app);
let userIDs = [];  // Storing the id or like array to

//mga buttons from the html
const addUserFormBtn = document.querySelector("#addUserFormBtn");
const updateUserFormBtn = document.querySelector("#updateUserFormBtn");
const removeUserFormBtn = document.querySelector("#removeUserFormBtn");
const addUserForm = document.querySelector("#addUserForm");
const updateUserForm = document.querySelector("#updateUserForm");
const removeUserForm = document.querySelector("#removeUserForm");

const addUserBtn = document.querySelector("#addUser");
const updateUserBtn = document.querySelector("#updateUser");
const delUserBtn = document.querySelector("#removeUser");
const userContainer = document.querySelector("[data-user-container]");
const rowTemplate = document.querySelector("[data-user-row]");

//get the users
const getUsers = async () => {
    const usersCollection = collection(db, "users"); //This part sets the users varriable in the database
    const getUsers = await getDocs(usersCollection);

    userIDs = [];
    userContainer.innerHTML = "";
    getUsers.forEach(async (doc) => {
        const docData = doc.data();
        userIDs.push(parseInt(doc.id));
        await appendUserToContainer(doc.id, docData.userName, docData.email, docData.userRole); //console log values
        // console.log("Doc.id= ", doc.id, "Username= ", docData.userName);
        // console.log("DocData: ", docData);
    });
    return userIDs;
};

const appendUserToContainer = async (usersID, userName, userEmail, userRole) => {
    const row = rowTemplate.content.cloneNode(true).children[0];
    const id = row.querySelector("[data-user-id]");
    const name = row.querySelector("[data-user-username]");
    const email = row.querySelector("[data-user-email]");
    const role = row.querySelector("[data-user-role]");

    id.textContent = usersID;
    name.textContent = userName;
    email.textContent = userEmail;
    role.textContent = userRole;
    userContainer.append(row);
};

//load all users on window load
window.addEventListener("load", getUsers);

//toggle add user form
addUserFormBtn.addEventListener('click', () => {
    addUserForm.classList.toggle("hidden");
});

//add new user
const addNewUser = async () => {
    const userNameInput = addUserForm.querySelector("[name=username]");
    const userEmailInput = addUserForm.querySelector("[name=email]");
    const userRoleInput = addUserForm.querySelector("[name=role]");
    await getUsers();

    let newID = 1;
    while (userIDs.includes(newID)) {
        newID++;// Ito ung gagamtin na id para kunin ung mga inputed id para magamit sa database
    }

    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();
    const userRole = userRoleInput.value.trim();

    try {
        //create user in Firebase Authentication
        const userPass = "defaultPassword"; //default pass ginamit namen since nag eeror sya if walang defaultPassword and userPass sa line nato 
        const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPass); // since nag defaultPassword kame need den i call out baka mag error
        const user = userCredential.user;

        //update user profile
        await updateProfile(user, {
            displayName: userName
        });

        //Dito nag store ung user details in Firestore with the user's UID
        await setDoc(doc(db, "users", user.uid), {
            userName: userName,
            email: userEmail,
            userRole: userRole,
            customID: newID //dito nagstore custom id na ginamit namen is customID since pede pala syang any var name
        });

        // console.log("User added successfully with the ID:", user.uid); // notify website kung nakapag add ng uid 
        await getUsers();
        addUserForm.reset();
        addUserForm.classList.add("hidden");
    } catch (error) {
        console.error("Error adding the user: ", error.message);
    }
};

//get personal details Firebase
const addToUserCollection = async (newID, username, email, userRole) => {
    try {
        const docRef = doc(db, "users", newID);
        await setDoc(docRef, {
            userName: username,
            email: email,
            userRole: userRole
        });
        // console.log(`Added to document with ID: ${docRef.id}!`);

    } catch (error) {
        console.error(`Error adding document: ${error.message}`);
    }
};

// console.log(addToUserCollection)

addUserBtn.addEventListener("click", addNewUser);


//toggle update user form
updateUserFormBtn.addEventListener('click', () => {
    updateUserForm.classList.toggle("hidden");
});

//update user
const updateUser = async () => {
    const userIdInput = updateUserForm.querySelector("[name=userId]");
    const userNameInput = updateUserForm.querySelector("[name=username]");
    const userEmailInput = updateUserForm.querySelector("[name=email]");
    const userRoleInput = updateUserForm.querySelector("[name=role]");

    const userID = userIdInput.value.trim();
    const userName = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    const userRole = userRoleInput.value.trim();
    const updateData = {};

    if (userName !== "") {
        updateData.userName = userName;
    }

    if (email !== "") {
        updateData.email = email;
    }

    if (userRole !== "") {
        updateData.userRole = userRole;
    }

    try {
        if (Object.keys(updateData).length > 0) {
            await updateDoc(doc(db, "users", userID), updateData);
            // console.log("User updated successfully with the ID:", userID);
        } else {
            console.error("No fields to update.");
        }
        await getUsers();
        updateUserForm.reset();
        updateUserForm.classList.add("hidden");
    } catch (error) {
        console.error("Error updating the user: ", error.message);
    }
};

updateUserBtn.addEventListener("click", updateUser);

//toggle remove user form
removeUserFormBtn.addEventListener('click', () => {
    removeUserForm.classList.toggle("hidden");
});

//remove user
const removeUser = async () => {
    const userIdInput = removeUserForm.querySelector("[name=userId]");
    const userID = userIdInput.value.trim();

    try {
        // await deleteDoc(doc(db, "users", userID));
        // await deleteUser(userID);
        // console.log("User removed successfully with the ID:", userID);


        await getUsers();
        removeUserForm.reset();
        removeUserForm.classList.add("hidden");
    } catch (error) {
        console.error("Error removing the user: ", error.message);
    }
};

delUserBtn.addEventListener("click", removeUser);

// // Authentication State Listener
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         console.log("User is authenticated");
//     } else {
//         window.location.href = "../entry_page.html";
//     }
// });
