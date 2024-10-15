var hamburger = document.getElementById('hamburger');
var trigger = document.getElementById('header');

hamburger.onclick = function () {
    hamburger.classList.toggle('open');
    trigger.classList.toggle('open');
    document.body.classList.toggle('menu-open');
}