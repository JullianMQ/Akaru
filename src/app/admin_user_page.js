const addUserFormBtn = document.getElementById('addUserFormBtn');
const updateUserFormBtn = document.getElementById('updateUserFormBtn');
const removeUserFormBtn = document.getElementById('removeUserFormBtn');

const addUserForm = document.getElementById('addUserForm');
const updateUserForm = document.getElementById('updateUserForm');
const removeUserForm = document.getElementById('removeUserForm');

const formsContainer = document.getElementById('formsContainer');

formsContainer.style.display = 'block';

function showForm(formToShow) {
    // formToShow.classList.remove('hidden');
    formsContainer.style.display = 'block';
}

addUserFormBtn.addEventListener('click', function () {
    addUserForm.classList.remove('hidden');
    updateUserForm.classList.add('hidden');
    removeUserForm.classList.add('hidden');
    formsContainer.style.display = 'block'; 
});

updateUserFormBtn.addEventListener('click', function () {
    addUserForm.classList.add('hidden');
    updateUserForm.classList.remove('hidden');
    removeUserForm.classList.add('hidden');
    formsContainer.style.display = 'block'; 
});

removeUserFormBtn.addEventListener('click', function () {
    addUserForm.classList.add('hidden');
    updateUserForm.classList.add('hidden');
    removeUserForm.classList.remove('hidden');
    formsContainer.style.display = 'block'; 
});

var hamburger = document.getElementById('hamburger');
var trigger = document.getElementById('header');


hamburger.onclick = function () {
    hamburger.classList.toggle('open');
    trigger.classList.toggle('open');
    document.body.classList.toggle('menu-open');
}