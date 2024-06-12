const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndexPage = (req, res, next) => {
    // console.log('inside shop: ', products);
    Product.findAll().then(
        result => {
            res.render('shop/product_list', {
                products: result,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: result.length > 0,
                activeShop: true,
                productCSS: true
            });
        }
    ).catch(
        err => console.log(err)
    );

};

exports.getProductDetails = (req, res, next) => {
    // console.log('inside prod details');
    const prodID = req.params.prodID;

    Product.findAll({ where: { id: prodID } }).then(
        products => {
            // console.log(products);
            if (products.length > 0) {
                res.render('shop/product-details', {
                    product: products[0],
                    pageTitle: products[0].title,
                    path: '/product'
                });
            }
        }
    ).catch(err => console.log(err));

    // Product.findByPk(prodID).then(
    //     result => {
    //         res.render('shop/product-details', {
    //             product: result,
    //             pageTitle: 'Product Details',
    //             path: '/product'
    //         });
    //     }
    // ).catch(err => console.log(err));

}

exports.getProductsData = (req, res, next) => {
    // console.log('inside shop: ', products);
    Product.findAll().then(
        result => {
            res.render('shop/product_list', {
                products: result,
                pageTitle: 'Products',
                path: '/products',
                hasProducts: result.length > 0,
                activeShop: true,
                productCSS: true
            });
        }
    ).catch(
        err => console.log(err)
    );
};



exports.getCartData = (req, res, next) => {

    //magic method as cart belongs to many products
    req.user.getCart().then(
        cart => {
            return cart.getProducts().then(
                products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Cart',
                        products: products,
                    });
                }).catch(
                    err => console.log(err)
                );
        }
    ).catch(err => console.log(err));


    // Cart.getCart(cart => {

    //     //Now we will find the products which are in the cart
    //     //For that we need to fetch products from the product model because
    //     //there is only id and price is stored in the cart but we need to display whole
    //     //details about the product in the cart

    //     Product.getAll(products => {

    //         const cartProducts = [];

    //         for (product of products) {

    //             const cartProductData = cart.products.find(
    //                 p => p.id === product.id
    //             );

    //             if (cartProductData) {

    //                 cartProducts.push({ productData: product, quantity: cartProductData.quantity, });

    //             }
    //         }

    //         res.render('shop/cart', {
    //             path: '/cart',
    //             pageTitle: 'Cart',
    //             products: cartProducts,
    //         });

    //     });
    // });
};

exports.postCartData = (req, res, next) => {
    // console.log('inside postCart: ');
    const prodID = req.body.prodID;
    let fetchedCart;
    let newQuantity = 1;
    console.log('inside postCart');
    req.user.getCart().then( // get existing cart
        cart => {
            fetchedCart = cart; // assign a copy of the cart for global access
            return cart.getProducts( // get the products that are selected and
                //existing in the cart
                { where: { id: prodID } }
            );
        }).then(
            products => {

                let product;
                if (products.length > 0) { // If we get the products then array shouldn't
                    //be null and we execute the block
                    product = products[0];
                }

                if (product) {

                    //this block is not executed that means we dont have selected
                    //product in the existing cart

                    const oldQuantity = product.cartItem.quantity;
                    newQuantity = oldQuantity + 1;
                    return product;

                }

                //So we have to find that product from the products db and put it
                //into the cart 
                return Product.findByPk(prodID);
            }).then(
                product => {
                    return fetchedCart.addProduct(product, {
                        through: { id: 1, quantity: newQuantity }
                    });
                }).then(
                    () => {
                        res.redirect('/cart');
                    }
                ).catch(
                    err => console.log(err)
                )

};

exports.deleteCartItem = (req, res, next) => {

    const prodID = req.body.productID;

    // console.log('from delete cart Item: ', req.body);
    //here we have to pass the price to the cart in order to remove the product from
    //cart and update the 

    Product.get(prodID, product => {
        console.log(product.price);
        Cart.deleteItem(prodID, product.price, () => {
            res.redirect('/cart');
        });
    });

}

exports.getOrdersData = (req, res, next) => {
    // console.log('inside shop: ', products);
    Product.getAll(products => {
        res.render('shop/orders', {
            products: products,
            pageTitle: 'Orders',
            path: '/orders',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};