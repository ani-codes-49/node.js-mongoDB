const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {

    // console.log('inside admin get');
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddProducts = (req, res, next) => {

    // console.log('inside post add');
    var request = req.body;
    const prod = new Product(
        request.title,
        request.price,
        request.imageUrl,
        request.description,
        null,
        req.user._id,
    );
    prod.save().then(
        result => {
            console.log(result);
            res.redirect('/');
        }
    ).catch(
        err => console.log(err)
    );

};

exports.getAdminEditProducts = (req, res, next) => {

    const prodID = req.params.productID;
    const isEditing = req.query.edit;
    if (isEditing == 'false') {
        Product.fetchAll().then(
            products => {
                res.render('admin/products', {
                    prods: products,
                    pageTitle: 'Admin Products',
                    path: '/admin/products'
                });
            }
        ).catch(err => console.log(err))

    } else {

        // console.log('inside getAdminEditProducts');
        Product.findById(prodID).then(
            product => {
                res.render('admin/edit-product', {
                    product: product,
                    pageTitle: 'Admin Products',
                    path: '/admin/products',
                    editing: isEditing,
                });
            }
        ).catch(
            err => console.log(err)
        );
    }

};

exports.postAdminEditProducts = (req, res, next) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    // Product.findByPk(prodId)
    const product = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDesc, prodId);
    product.save().then(
        () => {
            console.log('product modified');
            res.redirect('/');
        }
    ).catch(
        err => console.log(err)
    );
};

exports.postAdminDeleteProducts = (req, res, next) => {

    const prodID = req.query.id;

    Product.deleteById(prodID).then(
        () => {
            console.log('Product deleted');
            res.redirect('/');
        }
    ).catch(
        err => console.log(err)
    );
};