import { isUser, auth, db, checkAuthState, storage } from "./init.js"
import { doc, collection, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

// Firestore variables
const userId = isUser.uid;

// DOM VARIABLES
// const logOutBtn = document.querySelector("#logOutBtn");
const bookContainer = document.querySelector("#book_section");
const bookTemplate = document.querySelector("#book_template");
const bookDataArr = [];

// Uncomment after adding sidebar FRONTEND
// // Set username
// const setUsername = () => {
//     const userName = document.querySelector("#userName");
//     if(isUser !== "false") {
//         userName.textContent = isUser.displayName;
//         return 0;
//     }
//     userName.textContent = "Guest";
//     return 0;
// }
// // End Set username

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
const returnBook = () => {
    alert("Feature not yet implemented");
}

window.onload = getBooks();
