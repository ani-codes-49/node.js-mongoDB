const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndexPage = (req, res, next) => {
    // console.log('inside shop: ', products);
    Product.getAll(products => {
        res.render('shop/product_list', {
            products: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};

exports.getProductDetails = (req, res, next) => {
    // console.log('inside prod details');
    const prodID = req.params.prodID;
    // console.log(prodID);
    Product.get(prodID, product => {
        res.render('shop/product-details', {
            product: product,
            pageTitle: 'Product Details',
            path: '/product'
        });
    });

}

exports.getProductsData = (req, res, next) => {
    // console.log('inside shop: ', products);
    Product.getAll(products => {
        res.render('shop/product_list', {
            products: products,
            pageTitle: 'Products',
            path: '/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};



exports.getCartData = (req, res, next) => {
    Cart.getCart(cart => {

        //Now we will find the products which are in the cart
        //For that we need to fetch products from the product model because
        //there is only id and price is stored in the cart but we need to display whole
        //details about the product in the cart

        Product.getAll(products => {

            const cartProducts = [];

            for (product of products) {

                const cartProductData = cart.products.find(
                    p => p.id === product.id
                );

                if (cartProductData) {

                    cartProducts.push({ productData: product, quantity: cartProductData.quantity, });

                }
            }

            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Cart',
                products: cartProducts,
            });

        });
    });
};

exports.postCartData = (req, res, next) => {
    // console.log('inside postCart: ');
    const prodID = req.body.prodID;
    Product.get(prodID, product => {
        Cart.addProduct(prodID, product.price, () => {
            res.redirect('/cart');
        });
    });
}

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