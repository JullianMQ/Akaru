import './init.js';
// import '../users/userEntry.js'
if (window.location.pathname.includes('entry_page.html')) {
    import('./user_entry.js').then(module => {});
}
if (window.location.pathname.includes('admin_book_page.html')) {
    import('./admin_book.js').then(module => {});
    import('./admin_book_page.js').then(module => {});
}
if (window.location.pathname.includes('index1.html')) {
    import('./index.js').then(module => {});
    import('./index_frontend.js').then(module => {});
}
if (window.location.pathname.includes('admin_user.html')) {
    import('./admin_user.js').then(module => {});
    import('./admin_user_page.js').then(module => {});
}
if (window.location.pathname.includes('borrowed_books.html')) {
    import('./user_borrowed_books.js').then(module => {});
}
if (window.location.pathname.includes('admin_index.html')) {
    import('./admin_index.js').then(module => {});
}

// import '../users/firestore.js';
