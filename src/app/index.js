import { auth, db, storage, checkAuthState } from "./init.js"
import { doc, collection, addDoc, getDocs, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { signOut } from "firebase/auth";

// DOM VARIABLES
const logOutBtn = document.querySelector("#logOutBtn");
const searchBtn = document.querySelector("#searchBtn");
const bookContainer = document.querySelector("#book_section");
const bookTemplate = document.querySelector("#book_template");
const borrowBtnCard = document.querySelector("[data-book-borrow-btn]")

// Testing purposes only
// const addBookBtn = document.querySelector("#addBook");

const getBooks = async () => {
    const booksCollection = collection(db, "book");
    const getBooks = await getDocs(booksCollection);
    bookContainer.innerHTML = "";

    getBooks.forEach((doc) => {
        let bookName = doc.data().bookName;
        let bookCategory = doc.data().bookCategory;
        let bookAuthors = doc.data().authors;
        let bookImage = doc.data().imagePath;
        appendToContainer(bookName, bookCategory, bookAuthors, bookImage);
    })
};
searchBtn.addEventListener("click", getBooks);

const appendToContainer = (bookName, bookCategory, bookAuthors, bookImage) => {
    const bookTemp = bookTemplate.content.cloneNode(true).children[0];
    const img = bookTemp.querySelector("[data-book-img]");
    const name = bookTemp.querySelector("[data-book-name]");
    const category = bookTemp.querySelector("[data-book-category]");
    const authors = bookTemp.querySelector("[data-book-authors]");
    let authorsList = Object.values(bookAuthors || {});

    img.src = bookImage;
    name.textContent = bookName;
    category.innerHTML = bookCategory.join("<br>");
    authors.innerHTML = authorsList.join("<br>");
    bookContainer.append(bookTemp);
};

// TODO: ADD FILTERING AND SEARCHING


// TODO: ADD BORROWING BOOKS
const borrowBook = async () => {
    const user = checkAuthState();
    // console.log(user);
};

// Testing purposes only
// const addBook = async () => {
//     try {
//         // Fetch the JSON data
//         const response = await fetch('../public/json/books.json');
//         const books = await response.json();

//         // Get all documents in the "book" collection to determine the highest ID
//         const booksCollection = collection(db, "book");
//         const booksSnapshot = await getDocs(booksCollection);

//         // Find the highest ID currently in the Firestore collection
//         let highestId = 0;
//         booksSnapshot.forEach((doc) => {
//             const docId = parseInt(doc.id);
//             if (!isNaN(docId) && docId > highestId) {
//                 highestId = docId;
//             }
//         });

//         let nextId = highestId + 1; // Start from the next available ID

//         for (const book of books) {
//             const imageFileName = book.imagePath.split('/').pop(); // Extract the image file name
//             const imageRef = ref(storage, `book_images/${imageFileName}`);

//             // Upload the image to Firebase Storage
//             let imagePath = '';
//             const uploadTask = uploadBytesResumable(imageRef, await fetch(book.imagePath).then(res => res.blob()));

//             await new Promise((resolve, reject) => {
//                 uploadTask.on(
//                     'state_changed',
//                     null,
//                     (error) => {
//                         console.error("Image upload failed:", error);
//                         reject(error);
//                     },
//                     async () => {
//                         imagePath = await getDownloadURL(uploadTask.snapshot.ref);
//                         console.log("Image uploaded successfully:", imagePath);
//                         resolve();
//                     }
//                 );
//             });

//             // Add the book to Firestore with an incrementally assigned ID
//             await setDoc(doc(db, "book", nextId.toString()), {
//                 bookName: book.bookName,
//                 bookCategory: book.bookCategory,
//                 authors: book.authors,
//                 imagePath: imagePath
//             });

//             console.log(`Book added with ID: ${nextId}`);
//             nextId++; // Increment for the next book
//         }
//     } catch (error) {
//         console.error("Error adding books:", error.message);
//     }
// };

// // Trigger the addBook function on button click
// addBookBtn.addEventListener("click", async () => {
//     await addBook();
// });
// Testing purposes only

// Log Out Start
const userLogOut = async () => {
    // console.log("Log Out")
    signOut(auth)
        .then(() => {
            alert("Signed Out!")
        })
        .catch((error) => {
            console.log(error);
        });
};

// check if logged in, 
// TODO: if not then push them into login
window.onload = console.log(checkAuthState());
window.onload = getBooks();

logOutBtn.addEventListener("click", () => {
    userLogOut();
    // console.log(db);
});
// Log Out End
