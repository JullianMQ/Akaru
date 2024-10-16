import {
    doc,
    collection,
    setDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    getDoc
} from "firebase/firestore";
import { auth, isUser, db, storage, checkAuthState } from "./init.js"
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { signOut } from "firebase/auth";


let idArray = [];
let authorsMap = [];

// DOM VARIABLES
const logOutBtn = document.querySelector("#logOutBtn");
const userName = document.querySelector("#userName");
const isAdminElement = document.querySelector("[data-is-admin]");
const addBookForm = document.querySelector("#addBookForm");
const updateBookForm = document.querySelector("#updateBookForm");
const removeBookForm = document.querySelector("#removeBookForm");

const addBookBtn = document.querySelector("#addBook");
const updateBookBtn = document.querySelector("#updateBook");
const delBookBtn = document.querySelector("#removeBook");
const bookContainer = document.querySelector("[data-book-container]");
const rowTemplate = document.querySelector("[data-book-row]");

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

// Start Get Books
const getBooks = async () => {
    const booksCollection = collection(db, "book");
    const getBooks = await getDocs(booksCollection);
    idArray = [];
    bookContainer.innerHTML = "";

    const booksData = [];

    getBooks.forEach(async (doc) => {
        const docData = doc.data();
        idArray.push(parseInt(doc.id));
        booksData.push({
            id: parseInt(doc.id),
            data: docData
        });
    });

    idArray.sort((a, b) => a - b);

    for (let i = 0; i < idArray.length; i++) {
        const book = booksData.find(book => book.id === idArray[i]);
        if (book) {
            await appendToContainer(
                book.id,
                book.data.bookName,
                book.data.bookCategory,
                book.data.authors,
                book.data.imagePath
            );
        }
    }

    return idArray;
}

const appendToContainer = async (productID, productName, productCategory, productAuthors, productImage) => {
    const row = rowTemplate.content.cloneNode(true).children[0];
    const id = row.querySelector("[data-book-id]");
    const name = row.querySelector("[data-book-name]");
    const category = row.querySelector("[data-book-category]");
    const authors = row.querySelector("[data-book-authors]");
    const image = row.querySelector("[data-book-image]");
    let authorsList = Object.values(productAuthors || {});

    id.textContent = productID;
    name.textContent = productName;
    category.innerHTML = productCategory.join("<br>");
    authors.innerHTML = authorsList.join("<br>");

    if (productImage) {
        image.src = productImage;
    } else {
        image.src = "path/to/default/image.png";
    }

    bookContainer.append(row);
}



const checkFileExists = async (fileName) => {
    const listRef = ref(storage, 'book_images/');
    const result = await listAll(listRef);
    return result.items.some(item => item.name === fileName);
};

// Adding New Books
const addNewBook = async () => {
    const productNameInput = document.querySelectorAll("[name=prodName]");
    const productCategoryInput = document.querySelectorAll("[name=prodCategory]");
    const productAuthorInput = document.querySelectorAll("[name=prodAuthors]");
    const productImageInput = addBookForm.querySelector("[name=prodImage]");
    const productImage = productImageInput.files[0];
    await getBooks();

    let newId = 1;
    const prodName = productNameInput[0].value.trim();
    const prodCategory = productCategoryInput[0].value.split(",").map(x => x.trim()).filter(x => x !== "");
    const prodAuthors = productAuthorInput[0].value.split(",").map(x => x.trim()).filter(x => x !== "");

    // Appending number incase of multiple authors
    authorsMap = {};
    for (let i = 0; i < prodAuthors.length; i++) {
        let author = `Author${i + 1}`;
        authorsMap[author] = prodAuthors[i];
    }

    // idArray.sort((a, b) => a - b);
    // idArray.sort((a, b) => b - a);
    // Getting ID for books
    for (newId; newId <= idArray.length; newId++) {
        if (idArray.includes(newId)) { }
        else { break }
    }

    try {
        let imagePath = "";
        if (productImage) {
            const fileExists = await checkFileExists(productImage.name);

            if (fileExists) {
                alert("This file name is already taken and uploaded, try another file name.");
                return;
            }

            const imageRef = ref(storage, `book_images/${productImage.name}`);
            const uploadTask = uploadBytesResumable(imageRef, productImage);
            await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        reject(error);
                    },
                    async () => {
                        imagePath = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve();
                    }
                );
            });
        }

        await setDoc(doc(db, "book", newId.toString()), {
            bookName: prodName,
            bookCategory: prodCategory,
            authors: authorsMap,
            imagePath: imagePath
        });

        await getBooks();
        addBookForm.reset();
    } catch (error) {
        alert("Error deleting book: Check logs in dev tools");
        console.error("Error adding book:", error.message);
    }
};

addBookBtn.addEventListener("click", addNewBook);

// Updating Books
const updateBook = async () => {
    const productIdInput = updateBookForm.querySelector("[name=prodId]");
    const productNameInput = updateBookForm.querySelector("[name=prodName]");
    const productCategoryInput = updateBookForm.querySelector("[name=prodCategory]");
    const productAuthorInput = updateBookForm.querySelector("[name=prodAuthors]");
    const prodImageInput = updateBookForm.querySelector("[name=prodImage]");
    const prodImage = prodImageInput.files[0];

    const prodId = productIdInput.value.trim();
    const prodName = productNameInput.value.trim();
    const prodCategory = productCategoryInput.value.split(",").map(x => x.trim()).filter(x => x !== "");
    const prodAuthors = productAuthorInput.value.split(",").map(x => x.trim()).filter(x => x !== "");

    const updateData = {};

    if (prodName !== "") {
        updateData.bookName = prodName;
    }

    if (prodCategory.length > 0) {
        updateData.bookCategory = prodCategory;
    }

    if (prodAuthors.length > 0) {
        const updatedAuthorsMap = {};
        prodAuthors.forEach((author, index) => {
            updatedAuthorsMap[`Author${index + 1}`] = author;
        });
        updateData.authors = updatedAuthorsMap;
    }

    try {
        if (prodImage) {
            const fileExists = await checkFileExists(prodImage.name);

            if (fileExists) {
                alert("This file name is already taken and uploaded, try another file name.");
            }

            const imageRef = ref(storage, `book_images/${prodImage.name}`);
            const uploadTask = uploadBytesResumable(imageRef, prodImage);

            await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        console.error("Image upload failed:", error);
                        alert("Error deleting book: Check logs in dev tools");
                        reject(error);
                    },
                    async () => {
                        const imagePath = await getDownloadURL(uploadTask.snapshot.ref);
                        updateData.imagePath = imagePath;
                        resolve();
                    }
                );
            });
        }

        if (Object.keys(updateData).length > 0) {
            await updateDoc(doc(db, "book", prodId), updateData);
        }

        await getBooks();
        updateBookForm.reset();
    } catch (error) {
        console.error("Error updating book:", error.message);
        alert("Error deleting book: Check logs in dev tools");
    }
};

updateBookBtn.addEventListener("click", updateBook);

// Deleting Books
const deleteBook = async () => {
    const productId = document.querySelectorAll("[name=prodId]");
    const prodId = productId[1].value.trim();
    idArray = [];

    try {
        const bookDoc = doc(db, "book", prodId);
        const bookSnapshot = await getDoc(bookDoc);
        const bookData = bookSnapshot.data();

        if (!bookData) {
            throw new Error("No book found with the provided ID");
        }

        const imagePath = bookData.imagePath;

        if (imagePath) {
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
        } else {
            alert("No image deleted for this book");
        }

        await deleteDoc(bookDoc);

        await getBooks();
        removeBookForm.reset();
    } catch (error) {
        console.error("Error deleting book:", error.message);
        alert("Error deleting book: Check logs in dev tools");
    }
};
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

window.onload = getBooks();
window.onload = isAdmin();
delBookBtn.addEventListener("click", deleteBook);
