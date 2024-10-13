import { isUser, auth, db, checkAuthState, storage } from "./init.js"
import { doc, collection, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

// Firestore variables
const userId = isUser.uid;

// DOM VARIABLES
const logOutBtn = document.querySelector("#logOutBtn");
const bookContainer = document.querySelector("#book_section");
const bookTemplate = document.querySelector("#book_template");
const isAdminElement = document.querySelector("[data-is-admin]");
const bookDataArr = [];

// uncomment after adding sidebar FRONTEND
// // Get userRole
// const getUserRole = async () => {
//     const docRef = doc(db, "users", isUser.uid);
//     const getUserDoc = await getDoc(docRef);
//     const userRole = getUserDoc.data().userRole;
//     return userRole;
// }
// // End Get userRole

// // Set username
// const setUserState = async () => {
//     const userName = document.querySelector("#userName");
//     if (isUser !== "false") {
//         const isAdmin = await getUserRole();
//         userName.textContent = isUser.displayName;
//         if (isAdmin === "Admin") {
//             console.log(isAdminElement.style.display = "block");
//         }
//         return 0;
//     }
//     userName.textContent = "Guest";
//     logOutBtn.innerHTML = "Log In";
//     return 0;
// }
// // End Set username

const isLoggedIn = () => {
    if (isUser === "false") {
        window.location.href = "entry_page.html";
        return 0;
    }
    return 0;
}

const getBooks = async () => {
    const booksCollection = collection(db, "book");
    const getBooks = await getDocs(booksCollection);
    bookContainer.innerHTML = "";

    getBooks.forEach((doc) => {
        const userIdArray = doc.data().userId || [];
        const borrowBooks = userIdArray.some(books => books.includes(userId));

        if (borrowBooks) {
            let bookId = doc.id;
            let bookName = doc.data().bookName;
            let bookCategory = doc.data().bookCategory;
            let bookAuthors = doc.data().authors;
            let bookImage = doc.data().imagePath;
            appendToContainer(bookId, bookName, bookCategory, bookAuthors, bookImage);
        }
    })
    addReadFunction();
    addReturnFunction();
}

const appendToContainer = (bookId, bookName, bookCategory, bookAuthors, bookImage) => {
    const bookTemp = bookTemplate.content.cloneNode(true).children[0];
    const id = bookTemp.querySelector("[data-book-id]");
    const img = bookTemp.querySelector("[data-book-img]");
    const name = bookTemp.querySelector("[data-book-name]");
    const category = bookTemp.querySelector("[data-book-category]");
    const authors = bookTemp.querySelector("[data-book-authors]");
    const readBtn = bookTemp.querySelector("[data-book-read-btn]");
    const returnBtn = bookTemp.querySelector("[data-book-return-btn]");
    let authorsList = Object.values(bookAuthors || {});

    id.setAttribute("data-book-id", bookId);
    img.src = bookImage;
    name.textContent = bookName;
    category.innerHTML = bookCategory.join(", ");
    authors.innerHTML = authorsList.join(", ");

    bookContainer.append(bookTemp);

    bookDataArr.push({
        bookId: id,
        name: bookName,
        category: bookCategory,
        authors: authorsList.map(name => name.toLowerCase()),
        readBtn: readBtn,
        returnBtn: returnBtn,
        card: bookTemp,
    });
};

const addReadFunction = () => {
    bookDataArr.forEach((bookData) => {
    { bookData.readBtn.addEventListener("click", readBook) }
    })
}

const addReturnFunction = () => {
    bookDataArr.forEach((bookData) => {
    { bookData.returnBtn.addEventListener("click", returnBook) }
    })
}

// TODO: Add read function
const readBook = () => {
    alert("Feature not yet implemented");
}

// TODO: Add return function
const returnBook = async function (){
    const bookId = this.parentElement.querySelector("[data-book-id]").getAttribute("data-book-id");

    if(isUser !== "false") {
        const userId = isUser.uid;
        await removeUserFromBookUsers(userId, bookId);
        await removeBookFromUserBorrowedBooks(userId, bookId);
        alert("You have successfully returned the book!");
    }else{
        alert("Unable to return book.");
    }
}

//Remove user from book's userId(array)
const removeUserFromBookUsers = async (userId, bookId) =>{
    const bookDocRef = doc(db, "book", bookId);
    const bookDoc = await getDoc(bookDocRef);
    const bookUsers = bookDoc.data().userId || [];
    const updatedUsers = bookUsers.filter(id => id !== userId);

    if(!bookDoc.exists()){
        console.error("Book doesn't exist.");
        return; 
    }

    try {
        await updateDoc(bookDocRef, {
            userId: updatedUsers
        });
    }catch(error){
        console.error("Error on updating book users:", error);
    }
}

//Remove book from the borrowedBooks(array)
const removeBookFromUserBorrowedBooks = async (userId, bookId) => {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const borrowedBooks = userDoc.data().borrowedBooks || [];
    const updatedBooks = borrowedBooks.filter(id => id !== bookId);

    if (!userDoc.exists()){
        console.error("User document does not exist.");
        return; 
    }

    try{
        await updateDoc(userDocRef, {
            borrowedBooks: updatedBooks
        });
    }catch(error){
        console.error("Error on updating user's borrowed books:", error);
    }
}

window.onload = getBooks();
<<<<<<< HEAD

var hamburger = document.getElementById('hamburger');
var trigger = document.getElementById('header');


hamburger.onclick = function () {
    hamburger.classList.toggle('open');
    trigger.classList.toggle('open');
    document.body.classList.toggle('menu-open');
}
=======
window.onload = isLoggedIn();
>>>>>>> 66932661f5822927cdc0f9d33f3c6003c6972563
