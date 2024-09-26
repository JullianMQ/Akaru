import './init.js';
// import '../users/userEntry.js'
if (window.location.pathname.includes('entry_page.html')) {
    import('./userEntry.js').then(module => {});
}
if (window.location.pathname.includes('admin_book_page.html')) {
    import('./adminFirestore.js').then(module => {});
    import('./admin_book_page.js').then(module => {});
}
if (window.location.pathname.includes('index1.html')) {
    import('./index.js').then(module => {});
}
if (window.location.pathname.includes('admin_user.html')) {
    import('./admin_user.js').then(module => {});
    import('./admin_user_page.js').then(module => {});
}

// import '../users/firestore.js';
