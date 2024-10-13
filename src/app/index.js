import { isUser, auth, db, checkAuthState, storage } from "./init.js"
import { doc, collection, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";

// DOM VARIABLES
const logOutBtn = document.querySelector("#logOutBtn");
const userName = document.querySelector("#userName");
const searchInput = document.querySelector("#search-input");
const bookContainer = document.querySelector("#book_section");
const bookTemplate = document.querySelector("#book_template");
const isAdminElement = document.querySelector("[data-is-admin]");
const bookDataArr = [];


// // Testing purposes only
// const addBookBtn = document.querySelector("#addBook");

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
// // Testing purposes only

// Get userRole
const getUserRole = async () => {
    const docRef = doc(db, "users", isUser.uid);
    const getUserDoc = await getDoc(docRef);
    const userRole = getUserDoc.data().userRole;
    return userRole;
}
// End Get userRole

// Set username
const setUserState = async () => {
    if (isUser !== "false") {
        const isAdmin = await getUserRole();
        userName.textContent = isUser.displayName;
        if (isAdmin === "Admin") {
            isAdminElement.style.display = "flex";
        }
        return 0;
    }
    userName.textContent = "Guest";
    logOutBtn.innerHTML = "Log In";
    return 0;
}
// End Set username

// Get books
const getBooks = async () => {
    const booksCollection = collection(db, "book");
    const getBooks = await getDocs(booksCollection);
    bookContainer.innerHTML = "";

    getBooks.forEach((doc) => {
        let bookId = doc.id;
        let bookName = doc.data().bookName;
        let bookCategory = doc.data().bookCategory;
        let bookAuthors = doc.data().authors;
        let bookImage = doc.data().imagePath;
        appendToContainer(bookId, bookName, bookCategory, bookAuthors, bookImage);
    })
    addBorrowFunction();
    addSearchFilter();
};

const appendToContainer = (bookId, bookName, bookCategory, bookAuthors, bookImage) => {
    const bookTemp = bookTemplate.content.cloneNode(true).children[0];
    const id = bookTemp.querySelector("[data-book-id]");
    const img = bookTemp.querySelector("[data-book-img]");
    const name = bookTemp.querySelector("[data-book-name]");
    const category = bookTemp.querySelector("[data-book-category]");
    const authors = bookTemp.querySelector("[data-book-authors]");
    const borrowBtn = bookTemp.querySelector("[data-book-borrow-btn]");
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
        borrowBtn: borrowBtn,
        card: bookTemp,
    });
};
// End Get books

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
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    bookDataArr.forEach(book => {
        // look if genre inside array
        const isVisible = book.category.some(genre => genre.toLowerCase().includes(hash))
        book.card.classList.toggle("hidden", !isVisible);
    })
})
// End Category Filtering

// Borrowing book
// OPTIONAL TODO: MAKE ERROR HANDLING BETTER
const addBorrowFunction = () => {
    bookDataArr.forEach((bookData) => {
        { bookData.borrowBtn.addEventListener("click", borrowBook); }
    })
}

const borrowBook = async function () {
    const bookId = this.parentElement.querySelector("[data-book-id]");
    const idToAdd = bookId.getAttribute("data-book-id");
    checkAuthState();
    if (isUser !== "false") {
        const userId = isUser.uid;
        const result = await addToUserBorrowedBooks(userId, idToAdd);

        if (result === 1) {
            alert("Error: Book already borrowed");
            return;
        }
        if (result === 2) {
            alert("Error: Book limit reached");
            return;
        }
        if (result === -1) {
            alert("Error: Database error, please try again later");
        }
        alert("Successfully added book");
        return;

    } else {
        window.location.href = "entry_page.html";
    }
};

const getBorrowedBooks = async (userId, bookId) => {
    const docRef = doc(db, "users", userId);
    const userDoc = await getDoc(docRef);
    const userBorrowed = userDoc.data().borrowedBooks || [];

    if (userBorrowed.includes(bookId)) {
        return 1;
    }
    if (userBorrowed.length === 5) {
        return 2;
    }

    return userBorrowed;
}

const addToUserBorrowedBooks = async (userId, bookId) => {
    const isPossible = await getBorrowedBooks(userId, bookId);
    const docRef = doc(db, "users", userId);
    const updateBooks = isPossible;

    if (typeof isPossible != 'number') {
        try {
            updateBooks.push(bookId);
            await updateDoc(docRef, {
                borrowedBooks: updateBooks
            })
            await addToBookUsers(userId, bookId);
        } catch (error) {
            alert("There was an error in adding your book");
            console.error(error.code);
            console.error(error.message);
            return -1;
        }
        return 0;
    }
    return isPossible;
}

const getBookUsers = async (docRef) => {
    const bookDoc = await getDoc(docRef);
    const bookUsers = bookDoc.data().userId || [];
    return bookUsers;
}

const addToBookUsers = async (userId, bookId) => {
    const docRef = doc(db, "book", bookId);
    const bookUsers = await getBookUsers(docRef) || [];

    try {
        bookUsers.push(userId);
        updateDoc(docRef, {
            userId: bookUsers
        })
    } catch (error) {
        console.error(error.code);
        console.error(error.message);
        return -1;
    }
    return 0;
}
// End Borrowing book

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

window.onload = getBooks();
window.onload = setUserState();

logOutBtn.addEventListener("click", () => {
    userLogOut();
    checkAuthState();
});
// Log Out End
