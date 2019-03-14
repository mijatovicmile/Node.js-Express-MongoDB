// Controller for Page Not Found (404 page)
exports.error = (req, res, next) => {
    res.status(404).render('404', { 
        pageTitle: 'Page Not Found',
        pageId: 'pageNotFound',
        // Pass the information whether the user is authenticated or not
        isAuthenticated: req.session.isLoggedIn
    });
}