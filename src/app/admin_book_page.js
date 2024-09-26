const addBookFormBtn = document.getElementById('addBookFormBtn');
const updateBookFormBtn = document.getElementById('updateBookFormBtn');
const removeBookFormBtn = document.getElementById('removeBookFormBtn');

const addBookForm = document.getElementById('addBookForm');
const updateBookForm = document.getElementById('updateBookForm');
const removeBookForm = document.getElementById('removeBookForm');

const formsContainer = document.getElementById('formsContainer');

// console.log('Buttons:', addBookFormBtn, updateBookFormBtn, removeBookFormBtn);
// console.log('Forms:', addBookForm, updateBookForm, removeBookForm);
// console.log('Forms Container:', formsContainer);


// addBookForm.classList.add('hidden');
// updateBookForm.classList.add('hidden');
// removeBookForm.classList.add('hidden');
formsContainer.style.display = 'block';

function showForm(formToShow) {
    // formToShow.classList.remove('hidden');
    formsContainer.style.display = 'block';
}

addBookFormBtn.addEventListener('click', function () {
    // showForm(addBookForm);
    updateBookForm.classList.add('hidden');
    removeBookForm.classList.add('hidden');
    addBookForm.classList.remove('hidden')
    formsContainer.style.display = 'block';
});

updateBookFormBtn.addEventListener('click', function () {
    updateBookForm.classList.remove('hidden');
    removeBookForm.classList.add('hidden');
    addBookForm.classList.add('hidden')
    // showForm(updateBookForm);
});

removeBookFormBtn.addEventListener('click', function () {
    updateBookForm.classList.add('hidden');
    removeBookForm.classList.remove('hidden');
    addBookForm.classList.add('hidden')
    // showForm(removeBookForm);
});

// document.addEventListener('click', function (event) {
//     if (formsContainer && !formsContainer.contains(event.target) && !event.target.matches('.button')) {
// console.log('Clicking outside, hiding forms');
// formsContainer.style.display = 'none';
//     }
// });

