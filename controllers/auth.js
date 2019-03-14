const User = require('../models/user');

// User login controller - GET method
exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        pageTitle: 'Login',
        /**
         * Render a 'active' class on each of navigation links depending on which page we're on
         * We will render a 'active' class based on pageId
         */
        pageId: '/login',
        // Pass the information whether the user is authenticated or not
        isAuthenticated: false
    });
};

// User login controller - POST method
exports.postLogin = (req, res, next) => {
    /**
     * Instead of storing the information that the user is authenticated in the frontend, 
     * I will use sessions which is stored on the server side by using the session
     * 
     * A client needs to tell the server to which session he belongs because the session will 
     * be in stored in the memory or in the database
     * 
     * The memory is not an infinite resource, it's fine for development, but for a production 
     * server this would be horrible because if we have thousands of users in memory, 
     * it will quickly overflow if we store all that information in the memory
     * 
     * I want to share the authenticated information across all request 
     * of the same user, so the other users cant see other user data
     * 
     * (not sharing data across users) - different user will have different sessions
     */
    req.session.isLoggedIn = true; 

    /**
     * To be sure that my session has been set I will use request session and call the save method
     * to be sure that session was create before redirect to the home (shop) page...
     */
    req.session.save((err) => {
        console.log(err);
        res.redirect('/');
    })
};

// User logout controller
exports.postLogout = (req, res, next) => {
    // Clear the session when user logout
    req.session.destroy(err => {
        console.log(err);
        // Redirect to the home page (shop) 
        res.redirect('/');
    });
};