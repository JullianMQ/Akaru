var hamburger = document.getElementById('hamburger');
var trigger = document.getElementById('header');
var icon = document.getElementById('icon');

hamburger.onclick = function () {
    hamburger.classList.toggle('open');
    trigger.classList.toggle('open');
    document.body.classList.toggle('menu-open');
    if (icon.getAttribute("src") === "public/images/user-profile-dark.png") {
        icon.setAttribute("src", "public/images/user-profile.png");
    } else {
        icon.setAttribute("src", "public/images/user-profile-dark.png");
    }
}

