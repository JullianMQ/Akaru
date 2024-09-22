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
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Firestore Variables
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
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
        await appendToContainer(doc.id, docData.bookName, docData.bookCategory, docData.authors, docData.imagePath);
    })

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

    console.log(`Setting image for Book ID ${productID}: ${image.src}`);

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
    const productImageInput = addBookForm.querySelector("[name=prodImage]");
    const productImage = productImageInput.files[0];
    // get list of id in firestore
    await getBooks();


    // get id to be used for book
    let newId = 1;
    while (idArray.includes(newId)) {
        newId++;
    }
    // Katangahan sa javascript
    // console.log(idArray);
    // idArray.sort((a, b) => a - b);
    // idArray.sort((a, b) => b - a);
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
        let imagePath = "";
        if (productImage) {
            const imageRef = ref(storage, `book_images/${Date.now()}_${productImage.name}`);
            const uploadTask = uploadBytesResumable(imageRef, productImage);

            // Await the upload completion
            await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        console.error("Image upload failed:", error);
                        reject(error);
                    },
                    async () => {
                        imagePath = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Image uploaded successfully:", imagePath);
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

        console.log("Book added successfully with ID:", newId);
        await getBooks();
        addBookForm.reset();
        addBookForm.classList.add("hidden");
    } catch (error) {
        console.error("Error adding book:", error.message);
    }
};

addBookBtn.addEventListener("click", addNewBook);
// End Adding New Books

// Updating Books
updateBookFormBtn.addEventListener("click", () => {
    updateBookForm.classList.toggle("hidden");
})

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
            const imageRef = ref(storage, `book_images/${Date.now()}_${prodImage.name}`);
            const uploadTask = uploadBytesResumable(imageRef, prodImage);

            await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        console.error("Image upload failed:", error);
                        reject(error);
                    },
                    async () => {
                        const imagePath = await getDownloadURL(uploadTask.snapshot.ref);
                        updateData.imagePath = imagePath;
                        console.log("Image uploaded successfully:", imagePath);
                        resolve();
                    }
                );
            });
        }

        if (Object.keys(updateData).length > 0) {
            await updateDoc(doc(db, "book", prodId), updateData);
            console.log("Book updated successfully.");
        } else {
            console.log("No updates provided.");
        }

        await getBooks();
        updateBookForm.reset();
        updateBookForm.classList.add("hidden");
    } catch (error) {
        console.error("Error updating book:", error.message);
    }
};

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
