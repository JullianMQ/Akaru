import {
    doc,
    collection,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { auth, isUser, db, checkAuthState } from "./init.js"
import { signOut } from "firebase/auth";

//variables na ginamit for the id
let userIDs = [];  // Storing the id or like array to

//mga buttons from the html
const logOutBtn = document.querySelector("#logOutBtn");
const userName = document.querySelector("#userName");
const isAdminElement = document.querySelector("[data-is-admin]");
const addUserForm = document.querySelector("#addUserForm");
const updateUserForm = document.querySelector("#updateUserForm");
const removeUserForm = document.querySelector("#removeUserForm");

const addUserBtn = document.querySelector("#addUser");
const updateUserBtn = document.querySelector("#updateUser");
const delUserBtn = document.querySelector("#removeUser");
const userContainer = document.querySelector("[data-user-container]");
const rowTemplate = document.querySelector("[data-user-row]");

const getUserRole = async () => {
    const userDocRef = doc(db, "users", isUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userRole = userDoc.data().userRole;
    return userRole;
}

const isAdmin = async () => {
    if (isUser !== "false") {
        const userRole = await getUserRole();

        if (userRole === "User") {
            window.location.href = "index.html";
            return 1;
        }

        userName.textContent = isUser.displayName;
        isAdminElement.style.display = "flex";
        return 0;
    }
    window.location.href = "index.html";
    return 1;
}

//get the users
const getUsers = async () => {
    const usersCollection = collection(db, "users");
    const getUsers = await getDocs(usersCollection);

    userIDs = [];
    userContainer.innerHTML = "";
    getUsers.forEach(async (doc) => {
        const docData = doc.data();
        userIDs.push(parseInt(doc.id));
        await appendUserToContainer(doc.id, docData.userName, docData.email, docData.userRole); 
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

//toggle add user form
//add new user
const addNewUser = async () => {
    const userNameInput = addUserForm.querySelector("[name=username]");
    const userPassInput = addUserForm.querySelector("[name=passwd]");
    const userEmailInput = addUserForm.querySelector("[name=email]");
    const userRoleInput = addUserForm.querySelector("[name=role]");
    await getUsers();

    const userName = userNameInput.value.trim();
    const userPass = userPassInput.value.trim();
    const userEmail = userEmailInput.value.trim();
    const userRole = userRoleInput.value.trim();


    const objToSend = {
        displayName: userName,
        email: userEmail,
        password: userPass,
    };
    let userID;

    try {
        //create user in Firebase Authentication
        // METHOD TO ADD USER IN AUTHENTICATION WITH API
        await fetch("/api/users/create", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(objToSend),
        })
            .then(res => res.json())
            .then(data => {
                userID = data.user
            })
            .catch(err => console.error(err))

        await setDoc(doc(db, "users", userID), {
            userName: userName,
            email: userEmail,
            userRole: userRole,
            userPass: userPass
        });

        await getUsers();
        addUserForm.reset();
    } catch (error) {
        console.error("Error adding the user: ", error.message);
    }
};
addUserBtn.addEventListener("click", addNewUser);
// end add new user


//toggle update user form
//update user
const updateUser = async () => {
    const userIdInput = updateUserForm.querySelector("[name=userId]");
    const userNameInput = updateUserForm.querySelector("[name=username]");
    const userPasswdInput = updateUserForm.querySelector("[name=passwd]");
    const userEmailInput = updateUserForm.querySelector("[name=email]");
    const userRoleInput = updateUserForm.querySelector("[name=role]");

    const userID = userIdInput.value.trim();
    const userName = userNameInput.value.trim();
    const userPass = userPasswdInput.value.trim();
    const userEmail = userEmailInput.value.trim();
    const userRole = userRoleInput.value.trim();
    const updateData = {};

    if (userName !== "") {
        updateData.userName = userName;
    }

    if (userEmail !== "") {
        updateData.email = userEmail;
    }

    if (userRole !== "" && userRole != "Select a role") {
        updateData.userRole = userRole;
    }

    try {
        await fetch("api/users/change", {
            method: "PUT",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({
                uid: userID,
                displayName: userName,
                email: userEmail,
                password: userPass
            })
        })
            .then(res => res.json())
            .then(data => data)
            .catch(err => () => {
                alert("Error updating data: Check logs")
                console.error(err)
            })

        if (Object.keys(updateData).length > 0) {
            await updateDoc(doc(db, "users", userID), updateData);
        } else {
            console.error("No fields to update.");
        }
        await getUsers();
        updateUserForm.reset();
    } catch (error) {
        console.error("Error updating the user: ", error.message);
    }
};

updateUserBtn.addEventListener("click", updateUser);

//toggle remove user form
//remove user
const removeUser = async () => {
    const userIdInput = removeUserForm.querySelector("[name=userId]");
    const userID = userIdInput.value.trim();

    try {
        await fetch(`api/users/${userID}`, { method: "DELETE" });
        await deleteDoc(doc(db, "users", userID));
        await getUsers();
        removeUserForm.reset();
    } catch (error) {
        console.error("Error removing the user: ", error.message);
    }
};
delUserBtn.addEventListener("click", removeUser);


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

//load all users on window load
window.onload = getUsers();
window.onload = isAdmin();
