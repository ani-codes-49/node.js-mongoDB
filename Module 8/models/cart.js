
const fileSystem = require('fs');
const path = require('path');
const root_dir = require('../util/root_path');
const { json } = require('express');

const p = path.join(root_dir.rootPath, 'data', 'cart.json');

module.exports = class Cart {

    static addProduct(id, price, callback) {
        //fetch if anything previously was stored in the cart
        fileSystem.readFile(p, (err, fileContent) => {

            //initial cart state
            let existingProducts = { products: [], totalPrice: 0.0 };

            if (!err) {
                //If there is something present in the file before then only
                //we will enter into this block

                //getting existing produts in the form of map
                existingProducts = JSON.parse(fileContent);
            }
            console.log('from cart: ', existingProducts);
            //then we will find for that particular product for which
            //user wants to modify

            let existingProductIndex = existingProducts.products.findIndex(
                p => p.id == id
            );
            //If there is similar product present in the cart then we will increase its
            //quantity 

            //fetching the product by its index
            const existingProduct = existingProducts.products[existingProductIndex];
            let updatedProduct;

            if(existingProduct) {

                updatedProduct = {...existingProduct}; // will be seperated in a map
                updatedProduct.quantity += 1;

                //now updating the original product list with this newly edited product
                
                //for editing the product list first we have to fetch it and store it
                existingProducts.products = [...existingProducts.products]; 
                existingProducts.products[existingProductIndex] = updatedProduct;

            } else {
                //If there is no similar product present then we come inside this block
                updatedProduct = {id: id, quantity: 1};
                existingProducts.products = [...existingProducts.products, updatedProduct];
            }
            // console.log('from cart: ', existingProducts);
            existingProducts.totalPrice = existingProducts.totalPrice + +price;
            fileSystem.writeFile(p, JSON.stringify(existingProducts), err => {
                console.log('any error: ', err);
                if(!err) callback();
            });
        });
    
    
    }

    static getCart(callback) {

        fileSystem.readFile(p, (err, fileContent) => {

            if(err) {
                //if there is nothing in cart then we simply return the empty array
                callback(null);
            } else {
                callback(JSON.parse(fileContent));
            }

        });

    }

    static deleteItem(prodID, price, callback) {

        fileSystem.readFile(p, (err, fileContent) => {
            if(err) callback();
            
            const existingCart = {...JSON.parse(fileContent)}; //It will be split in a map

            //
            const product = existingCart.products.find(
                p => p.id === prodID
            );

            if(!product) callback();

            const existingProductQuantity = product.quantity;

            existingCart.products = existingCart.products.filter(
                p => p.id !== prodID
            );

            existingCart.totalPrice = existingCart.totalPrice - existingProductQuantity * price;

            fileSystem.writeFile(p, JSON.stringify(existingCart), err => {
                if(!err) callback();
                console.log(err);
            });

        })

    }

}