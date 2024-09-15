import './init.js';
// import '../users/userEntry.js'
if (window.location.pathname.includes('entry_page.html')) {
    import('../users/userEntry.js').then(module => {});
}
if (window.location.pathname.includes('admin_book_page.html')) {
    import('../admin/testFirestore.js').then(module => {});
}
// import '../users/firestore.js';
