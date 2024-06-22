const Product = require('../models/product');

exports.getIndexPage = (req, res, next) => {

    Product.fetchAll().then(
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
    const prodID = req.params.productID;
    // console.log('inside prod details', prodID);
    Product.findById(prodID).then(
        product => {
            res.render('shop/product-details', {
                product: product,
                pageTitle: product.title,
                path: '/product'
            });
        }
    ).catch(err => console.log(err));

}

exports.getProductsData = (req, res, next) => {
    // console.log('inside shop: ', products);
    Product.fetchAll().then(
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
        products => {
            // console.log(products);
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Cart',
                products: products,
            });

        }
    ).catch(err => console.log(err));

};

exports.postCartData = (req, res, next) => {
    // console.log('inside postCart: ');
    const prodID = req.body.productID;

    //getting product which is to be added in the cart

    Product.findById(prodID).then(product => {
        return req.user.addToCart(product);
    }).then(result => {
        console.log('product added to cart');
        res.redirect('/cart');
    }
    );

};

exports.deleteCartItem = (req, res, next) => {

    const prodID = req.body.productID;
    console.log(prodID);
    req.user.deleteItem(prodID).then(
        products => {
            console.log(products);
            let product = products[0];
            //magic method
            if (product) return product.cartItem.destroy();
        }
    ).then(
        result => {
            res.redirect('/cart');
        }
    ).catch(
        err => console.log(err)
    );

}

exports.postOrdersData = (req, res, next) => {

    req.user.addOrder().then(
        result => {
            res.redirect('/orders');
        }
    ).then(
        result => {
            console.log('cart cleared');
        }
    ).catch(
        err => console.log(err)
    );

}

exports.getOrdersData = (req, res, next) => {
    // console.log('inside shop: ', products);
    req.user.getOrders()
    .then(
        orders => {
            console.log(orders);
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your orders',
                orders: orders,
            }
            );
        }
    ).catch(
        err => console.log(err)
    );
};