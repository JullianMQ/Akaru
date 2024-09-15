import {
    getAuth,
    onAuthStateChanged
} from "firebase/auth";
import {
    doc,
    collection,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    getFirestore
} from "firebase/firestore";
import { app } from "../public/init.js"


// Firestore Variables
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Variables
const addBookBtn = document.querySelector("#addBook");
const updateBookBtn = document.querySelector("#updateBook");
const delBookBtn = document.querySelector("#removeBook");
const bookContainer = document.querySelector("[data-book-container]")
const rowTemplate = document.querySelector("[data-book-row]");

// Start Get Books
// For getting all the books
const getBooks = async () => {
    const booksCollection = collection(db, "book");
    const getBooks = await getDocs(booksCollection);
    getBooks.forEach(async (doc) => {
        const docData = doc.data();
        // console.log(docData.bookName);
        await appendToContainer(doc.id, docData.bookName, docData.bookCategory, docData.authors, "Available", docData.imagePath);
    })
    // console.log(getBooks);
}

const appendToContainer = async (productID, productName, productCategory, productAuthors, productAvailability, productImage) => {
    const row = rowTemplate.content.cloneNode(true).children[0];
    const id = row.querySelector("[data-book-id]");
    const name = row.querySelector("[data-book-name]");
    const category = row.querySelector("[data-book-category]");
    const authors = row.querySelector("[data-book-authors]");
    const availability = row.querySelector("[data-book-availability]");
    const image = row.querySelector("[data-book-image]");
    const authorsList = await productAuthors;
    console.log(Object.values(authorsList));
    // console.log(productAuthors.value.split(","));
    
    id.textContent = productID;
    name.textContent = productName;
    category.textContent = productCategory;
    authors.textContent = Object.values(authorsList);
    availability.textContent = productAvailability;
    image.src = productImage;
    bookContainer.append(row);
    
}
// appendToContainer();
// console.log(bookContainer);


// For searching
const getBook = async () => {
}
// End Get Books

window.onload = getBooks();
// document.onload = getBooks();

// Adding New Books
const addBook = async () => {
    try {
        const docRef = doc(db, "book", "FirstBook");
        await setDoc(docRef, {
            bookName: 'Test1',
            bookCategory: ['Horror', 'Fantasy', 'Thriller'],
            imagePath: "Path here in Firebase Storage",
            authors: { Author1: 'Leonardo Di Caprio', Author2: 'Alice Guo' }
        });
        await getBooks();
        console.log("Added Book!");
    } catch (error) {
        console.error(`Error adding document: ${error.message}`);
    }
}

addBookBtn.addEventListener("click", addBook)
// End Adding New Books

// Updating Books

// End Updating Books

// Deleting Books
const deleteBook = async () => {
    try {
        const docRef = doc(db, "book", "FirstBook");
        deleteDoc(docRef);
        await getBooks();
    } catch (error) {
        console.error(`Error adding document: ${error.message}`);
    }
};

delBookBtn.addEventListener("click", deleteBook);
// End Deleting Books


// export { db, addBook };
