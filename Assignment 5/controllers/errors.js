exports.noPageFound = (req, res, next) => {
    // const isLoggedIn = req.get("Cookie").split(';')[0].trim().split(':')[1].trim() === 'true';
    res.status(404).render('error', {
        pageTitle: 'Page not found',
        path: '',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        isAuthenticated: req.session.isLoggedIn,
    });
};