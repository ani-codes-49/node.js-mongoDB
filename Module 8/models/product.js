
const fileSystem = require('fs');
const path = require('path');
const root_dir = require('../util/root_path');
const p = path.join(root_dir.rootPath, 'data', 'products.json');
const Cart = require('./cart');

const getProductDataFromFile = callback => {

    fileSystem.readFile(p, (err, fileData) => {
        if (!err) {
            callback(JSON.parse(fileData));
        } else {
            return callback([]);
        }
    });

}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }


    //adds a new product in the list
    add() {
        getProductDataFromFile(products => {
            //If the product exists already then we need to update the product 
            //otherwise we nee to create a new product
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    prod => prod.id === this.id
                );
                
                let existingProducts = [...products];
                existingProducts[existingProductIndex] = this;
                fileSystem.writeFile(p, JSON.stringify(existingProducts), err => {
                    console.log('error is: ', err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fileSystem.writeFile(p, JSON.stringify(products), err => {
                    console.log('error is: ', err);
                });
            }
        }); //getting the existing data into the array and appending at the end of it

    }

    //returns all products
    //writeFile() is a asynchronoous function so it will
    //execute in the future so if we want to send data only when the products
    //are retrieved then we can pass a callback and then this function will call 
    //that function and there we can access the passed product array and perform the 
    //further stuff
    static getAll(callback) {

        getProductDataFromFile(callback);

    }

    static get(id, callback) {

        getProductDataFromFile(products => {
            const product = products.find(p => p.id === id);
            callback(product);
        }

        );
    }

    static delete(id, callback) {
        let existingProducts = [];
        this.getAll(products => {
            const product = products.find(prod => prod.id === id);
            existingProducts = products.filter(
                prod => prod.id !== id
            );
            fileSystem.writeFile(p, JSON.stringify(existingProducts), err => {
                console.log('any error');
                if (!err) {
                    Cart.deleteItem(product.id, product.price, () => {
                        callback();
                    });
                }
            });
        });

    }
}