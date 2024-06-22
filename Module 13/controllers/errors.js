exports.noPageFound = (req, res, next) => {
    res.status(404).render('error', {
        pageTitle: 'Page not found',
        path: '',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};