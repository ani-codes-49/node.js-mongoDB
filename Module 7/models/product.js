
const fileSystem = require('fs');
const path = require('path');
const root_dir = require('../util/root_path');
const p = path.join(root_dir.rootPath, 'data', 'products.json');

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
    constructor(t) {
        this.title = t;
    }

    //adds a new product in the list
    add() {
        getProductDataFromFile(products => {
            products.push(this);
            fileSystem.writeFile(p, JSON.stringify(products), err => {
                console.log('error is: ', err);
            });
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

}