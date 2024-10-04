import { auth, db, storage, checkAuthState } from "./init.js"
import { doc, collection, addDoc, getDocs, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

// DOM VARIABLES
const logOutBtn = document.querySelector("#logOutBtn");
const searchInput = document.querySelector("#search-input");
const bookContainer = document.querySelector("#book_section");
const bookTemplate = document.querySelector("#book_template");
const bookDataArr = [];

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
    addSearchFilter();
};

const appendToContainer = (bookName, bookCategory, bookAuthors, bookImage) => {
    const bookTemp = bookTemplate.content.cloneNode(true).children[0];
    const img = bookTemp.querySelector("[data-book-img]");
    const name = bookTemp.querySelector("[data-book-name]");
    const category = bookTemp.querySelector("[data-book-category]");
    const authors = bookTemp.querySelector("[data-book-authors]");
    const borrowBtn = bookTemp.querySelector("[data-book-borrow-btn]");
    let authorsList = Object.values(bookAuthors || {});

    img.src = bookImage;
    name.textContent = bookName;
    category.innerHTML = bookCategory.join(", ");
    authors.innerHTML = authorsList.join(", ");

    bookContainer.append(bookTemp);

    bookDataArr.push({
        name: bookName,
        category: bookCategory,
        authors: authorsList.map(name => name.toLowerCase()),
        borrowBtn: borrowBtn,
        card: bookTemp
    });
};

// Search Function || Search Filter
const addSearchFilter = () => {
    searchInput.addEventListener("input", queryInput => {
        let query = queryInput.target.value.toLowerCase();
        bookDataArr.forEach(book => {
            // If name or author in search query
            const isBookName = book.name.toLowerCase().includes(query);
            const isAuthorName = book.authors.some(author => author.includes(query));
            const isVisible = isBookName || isAuthorName;
            book.card.classList.toggle("hidden", !isVisible);
        })
        window.location.hash = "";
    })
}

// Category Filtering
const navSearch = document.querySelectorAll(".category");
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    bookDataArr.forEach(book => {
        // look if genre inside array
        const isVisible = book.category.some(genre => genre.toLowerCase().includes(hash))
        book.card.classList.toggle("hidden", !isVisible);
    })
})

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
    signOut(auth)
        .then(() => {
            alert("Signed Out!")
        })
        .catch((error) => {
            alert("Something went wrong: Check the logs");
            console.log(error.message);
        });
};

// check if logged in, 
// TODO: if not then push them into login
window.onload = checkAuthState();
window.onload = getBooks();

logOutBtn.addEventListener("click", () => {
    userLogOut();
    // console.log(db);
});
// Log Out End
