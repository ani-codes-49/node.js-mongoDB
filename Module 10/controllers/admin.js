const { where } = require('sequelize');
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

    var request = req.body;

    //this is the magic association method because we have association of products 
    //and users so sequelize adds methods depending on the associations
    //and adds the foreign key accordingly
    req.user.createProduct({
        title: request.title,
        price: request.price,
        imageUrl: request.imageUrl,
        description: request.description,
    }).then(
        result => {
            // console.log(result);
            res.redirect('/');
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

    //console.log(request);
    // Product.create({
    //     title: request.title,
    //     price: request.price,
    //     imageUrl: request.imageUrl,
    //     description: request.description,
    //     userId: req.user.id,
    // }).then(
    //     result => {
    //         console.log(result);
    //         res.redirect('/');
    //     }
    // ).catch(
    //     err => {
    //         console.log(err);
    //     }
    // );

};

exports.getAdminEditProducts = (req, res, next) => {

    const prodID = req.params.productID;
    const isEditing = req.query.edit;

    if (!isEditing) {
        return res.redirect('/');
    }

    // Product.findByPk(prodID)
    req.user.getProducts({ where: { id: prodID } })
        .then(
            result => {
                res.render('admin/edit-product', {
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    product: result[0], // as the method returns the array
                    editing: isEditing,
                });
            }
        ).catch(
            err => console.log(err)
        );

};

exports.postAdminEditProducts = (req, res, next) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    // Product.findByPk(prodId)
    req.user.getProducts({ where: { id: prodId } })
        .then(
            product => {
                product[0].title = updatedTitle;
                product[0].price = updatedPrice;
                product[0].imageUrl = updatedImageUrl;
                product[0].description = updatedDesc;
                product[0].save().then(
                    result => {
                        console.log('PRODUCT HAS BEEN MODIFIED', result);
                        res.redirect('/admin/products');
                    }
                ).catch(
                    err => console.log(err)
                ); //method provided by sequelize to update/ create a product
            }
        ).catch(err => {
            console.log(err);
        });

};

exports.postAdminDeleteProducts = (req, res, next) => {

    const prodID = req.query.id;

    Product.destroy(
        { where: { id: prodID } }
    ).then(
        result => {
            console.log('Product Destroyed', result);
            res.redirect('/');
        }
    ).catch(
        err => {
            console.log(err)
        }
    );

    // Product.findByPk(prodID).then(
    //     result => {
    //         result.destroy();
    //         console.log('Product Destroyed', result);
    //         res.redirect('/');
    //     }
    // ).catch(
    //     err => {
    //         console.log(err)
    //     }
    // );
};

exports.getAdminProducts = (req, res, next) => {

    // console.log('inside admin get');
    Product.findAll().then(
        result => {
            res.render('admin/products', {
                prods: result,
                pageTitle: 'Add Product',
                path: '/admin/products',
                formsCSS: true,
                productCSS: true,
                activeAddProduct: true
            });
        }
    ).catch(
        err => console.log(err)
    );

}
