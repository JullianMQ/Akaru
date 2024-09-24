import './init.js';
// import '../users/userEntry.js'
if (window.location.pathname.includes('entry_page.html')) {
    import('./userEntry.js').then(module => {});
}
if (window.location.pathname.includes('admin_book_page.html')) {
    import('./adminFirestore.js').then(module => {});
}
if (window.location.pathname.includes('index.html')) {
    import('./index.js').then(module => {});
}
// import '../users/firestore.js';
