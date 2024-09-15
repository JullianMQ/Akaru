// Your web app's Firebase configuration
import {
    collection,
    getFirestore,
    getDoc,
    getDocs,
    addDoc,
}
    from "firebase/firestore"
import { app } from "../public/init.js";

const db = getFirestore(app);

// Get all Data in Real-Time
async function GetAllDataRealtime() {
    const querySnapshot = await getDocs(collection(db, "books"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });

    // const docRef = doc(db, "books", uid);
    // const querySnapshot = getDocs(collection(db, "books"));
    // querySnapshot.forEach(doc => {
    //     var book = [];
    //     let data = doc.data();
    //     data.id = doc.id;  // Store document ID
    //     book.push(data);
    // });
    // AddAllItemsToTheTable(book);
}

// Filling the table
var tbody = document.getElementById('tbody1');

function AddItemToTable(author, bookid, bookname, category1, category2, category3, userid, docId) {
    var trow = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td'); // For the update button
    var td8 = document.createElement('td'); // For the delete button

    td1.innerHTML = author;
    td2.innerHTML = bookid;
    td3.innerHTML = bookname;
    td4.innerHTML = category1;
    td5.innerHTML = category2;
    td6.innerHTML = category3;
    td7.innerHTML = userid;

    // Update button
    var updateBtn = document.createElement('button');
    updateBtn.innerHTML = "Update";
    updateBtn.onclick = function () {
        // Populate the update form with current values
        document.getElementById('updateAuthor').value = author;
        document.getElementById('updateBookID').value = bookid;
        document.getElementById('updateBookName').value = bookname;
        document.getElementById('updateCategory1').value = category1;
        document.getElementById('updateCategory2').value = category2;
        document.getElementById('updateCategory3').value = category3;
        document.getElementById('updateUserID').value = userid;
        document.querySelector('.update').setAttribute('data-doc-id', docId);
    };

    // Delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "Delete";
    deleteBtn.onclick = function () {
        deleteBook(docId);
    };

    // Append the buttons to the respective columns (td7 and td8)
    td7.appendChild(updateBtn);
    td8.appendChild(deleteBtn);

    // Append all td elements to the row
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);
    trow.appendChild(td7);
    trow.appendChild(td8);

    tbody.appendChild(trow);
}

function AddAllItemsToTheTable(StudentDocsList) {
    tbody.innerHTML = "";
    StudentDocsList.forEach(element => {
        AddItemToTable(element.Author, element.BookID, element.BookName, element.Category1, element.Category2, element.Category3, element.UserID, element.id);
    });
}

window.onload = GetAllDataRealtime;

// Adding Documents
document.querySelector('.add').addEventListener('submit', async (e) => {
    e.preventDefault();
    GetAllDataRealtime();

    const author = document.getElementById('Author').value;
    const bookID = document.getElementById('BookID').value;
    const bookName = document.getElementById('BookName').value;
    const category1 = document.getElementById('Category1').value;
    const category2 = document.getElementById('Category2').value;
    const category3 = document.getElementById('Category3').value;
    const userID = document.getElementById('UserID').value;

    const categoryArray = [Category1, Category2, category3];
    const collectionRef = collection(db, "books");
    await addDoc(collectionRef, {
        Author: author,
        BookID: bookID,
        BookName: bookName,
        Category1: category1,
        Category2: category2,
        Category3: category3,
        UserID: userID
    }).then(() => {
        alert("Book added successfully!");
        document.querySelector('.add').reset();
    }).catch((error) => {
        console.error("Error adding book: ", error);
    });
});

// Delete Document
function deleteBook(docId) {
    collection(db, "books").doc(docId).delete().then(() => {
    }).catch((error) => {
        console.error("Error deleting book: ", error);
    });
}

// Update Document
document.querySelector('.update').addEventListener('submit', (e) => {
    e.preventDefault();

    const docId = e.target.getAttribute('data-doc-id');
    const author = document.getElementById('updateAuthor').value;
    const bookID = document.getElementById('updateBookID').value;
    const bookName = document.getElementById('updateBookName').value;
    const category1 = document.getElementById('updateCategory1').value;
    const category2 = document.getElementById('updateCategory2').value;
    const category3 = document.getElementById('updateCategory3').value;
    const userID = document.getElementById('updateUserID').value;

    collection("books").doc(docId).update({
        Author: author,
        BookID: bookID,
        BookName: bookName,
        Category1: category1,
        Category2: category2,
        Category3: category3,
        UserID: userID
    }).then(() => {
        document.querySelector('.update').reset();
    }).catch((error) => {
        console.error("Error updating book: ", error);
    });
});
