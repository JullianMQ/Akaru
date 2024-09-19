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
let idArray = [];
let authorsMap = {};

// DOM Variables
const addBookFormBtn = document.querySelector("#addBookFormBtn");
const updateBookFormBtn = document.querySelector("#updateBookFormBtn");
const removeBookFormBtn = document.querySelector("#removeBookFormBtn");
const addBookForm = document.querySelector("#addBookForm");
const updateBookForm = document.querySelector("#updateBookForm");
const removeBookForm = document.querySelector("#removeBookForm");

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
    idArray = [];
    bookContainer.innerHTML = "";
    getBooks.forEach(async (doc) => {
        const docData = doc.data();
        idArray.push(parseInt(doc.id));

        // Show authors
        // console.log(Array.isArray(docData.authors));
        await appendToContainer(doc.id, docData.bookName, docData.bookCategory, docData.authors, "Available", docData.imagePath);
    })

    return idArray;
}

const appendToContainer = async (productID, productName, productCategory, productAuthors, productAvailability, productImage) => {
    const row = rowTemplate.content.cloneNode(true).children[0];
    const id = row.querySelector("[data-book-id]");
    const name = row.querySelector("[data-book-name]");
    const category = row.querySelector("[data-book-category]");
    const authors = row.querySelector("[data-book-authors]");
    const availability = row.querySelector("[data-book-availability]");
    const image = row.querySelector("[data-book-image]");
    let authorsList = await productAuthors;
    authorsList = Object.values(authorsList);

    id.textContent = productID;
    name.textContent = productName;
    category.innerHTML = productCategory.join("<br>");
    authors.innerHTML = Object.values(authorsList).join("<br>");
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

// Load All books on page load
window.onload = getBooks();

// Adding New Books
addBookFormBtn.addEventListener("click", () => {
    addBookForm.classList.toggle("hidden");
})

const addNewBook = async () => {
    const productNameInput = document.querySelectorAll("[name=prodName]");
    const productCategoryInput = document.querySelectorAll("[name=prodCategory]");
    const productAuthorInput = document.querySelectorAll("[name=prodAuthors]");
    // get list of id in firestore
    await getBooks();


    // get id to be used for book
    let inc = 1;
    for (let index = 1; index < idArray.length + 1; index++) {
        if (index != idArray[index - 1]) {
            inc = index;
            break;
        } else {
            inc++
        }

    }

    // Katangahan sa javascript
    // console.log(idArray);
    idArray.sort((a, b) => a - b);
    idArray.sort((a, b) => b - a);
    // // for (inc = 0; inc < idArray.length; inc++) {
    // //     console.log(inc)
    // //     if (idArray.includes(inc.toString())) {
    // //         console.log(true)
    // //     }
    // // }
    // while (idArray.includes(inc.toString())) {
    //     inc++;
    // }

    // FireStorage: ADD IMAGE SUPPORT HERE

    const prodName = productNameInput[0].value.trim();
    const prodCategory = productCategoryInput[0].value.split(",").map(x => x.trim()).filter(x => x !== "");
    const prodAuthors = productAuthorInput[0].value.split(",").map(x => x.trim()).filter(x => x !== "");

    authorsMap = {};
    for (let i = 0; i < prodAuthors.length; i++) {
        let author = `Author${i + 1}`;
        authorsMap[author] = prodAuthors[i];
    }

    try {
        await setDoc(doc(db, "book", inc.toString()), {
            bookName: prodName,
            bookCategory: prodCategory,
            authors: authorsMap
        })
        await getBooks();
    } catch (error) {
        console.error(error.message);
    }
}

addBookBtn.addEventListener("click", addNewBook);
// End Adding New Books

// Updating Books
updateBookFormBtn.addEventListener("click", () => {
    updateBookForm.classList.toggle("hidden");
})

const updateBook = async () => {
    const productId = document.querySelectorAll("[name=prodId]")
    const productNameInput = document.querySelectorAll("[name=prodName]");
    const productCategoryInput = document.querySelectorAll("[name=prodCategory]");
    const productAuthorInput = document.querySelectorAll("[name=prodAuthors]");
    // get size of firestore

    // FireStorage: ADD IMAGE SUPPORT HERE

    const prodId = productId[0].value.trim();
    const prodName = productNameInput[1].value.trim();
    const prodCategory = productCategoryInput[1].value.split(",").map(x => x.trim()).filter(x => x !== "");
    const prodAuthors = productAuthorInput[1].value.split(",").map(x => x.trim()).filter(x => x !== "");

    const toBePushed = new Map();
    toBePushed.set("bookName", prodName);
    toBePushed.set("bookCategory", prodCategory);
    toBePushed.set("authors", prodAuthors);

    authorsMap = {};
    for (let i = 0; i < prodAuthors.length; i++) {
        let author = `Author${i + 1}`;
        authorsMap[author] = prodAuthors[i];
    }


    try {
        if (toBePushed.get("bookName") != "") {
            await updateDoc(doc(db, "book", prodId), {
                bookName: prodName
            })
        }
        if (toBePushed.get("bookCategory").length != 0) {
            await updateDoc(doc(db, "book", prodId), {
                bookCategory: prodCategory
            })
        }
        if (toBePushed.get("authors").length != 0) {
            await updateDoc(doc(db, "book", prodId), {
                authors: authorsMap
            })
        }
        await getBooks();
    } catch (error) {
        console.error(error.message);
    }

}

updateBookBtn.addEventListener("click", updateBook);
// End Updating Books

// Deleting Books
removeBookFormBtn.addEventListener("click", () => {
    removeBookForm.classList.toggle("hidden");
})

const deleteBook = async () => {
    const productId = document.querySelectorAll("[name=prodId]")
    const productNameInput = document.querySelectorAll("[name=prodName]");

    const prodId = productId[1].value.trim();
    const prodName = productNameInput[2].value.trim();
    idArray = [];

    try {
        await deleteDoc(doc(db, "book", prodId));
        await getBooks();
    } catch (error) {
        console.error(error.message);
    }
};

delBookBtn.addEventListener("click", deleteBook);
// End Deleting Books


// export { db, addBook };
