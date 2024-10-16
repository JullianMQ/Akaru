const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

loginBtn.addEventListener('click', () => {
    container.classList.add("active");
});

registerBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

var hamburger = document.getElementById('hamburger');
var trigger = document.getElementById('header');

hamburger.onclick = function () {
    hamburger.classList.toggle('open');
    trigger.classList.toggle('open');
    document.body.classList.toggle('menu-open');
}
