const getdb = require('../util/database');
const mongoDB = require('mongodb');

class Product {
    constructor(title, price, imageUrl, description, id, userID) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new mongoDB.ObjectId(id) : null;
        this.userID = userID;
    }
    save() {

        let databaseOP;
        const db = getdb.getDB();
        console.log(this._id);
        if (this._id) {
            databaseOP = db.collection('products').updateOne(
                { _id: this._id }, {
                $set: this
            }
            );
        } else {
            databaseOP = db.collection('products').insertOne(this);
        }
        // console.log('db: ', db);
        return databaseOP;
    }

    static findById(productId) {
        const db = getdb.getDB();

        return db.collection('products').find({ _id: new mongoDB.ObjectId(productId) })
            .next()// this method is used to tell mongo that please give me next record
            //(if any)
            .then(
                product => {
                    console.log(product);
                    return product;
                }
            ).catch(
                err => console.log(err)
            );

    }

    static fetchAll() {
        const db = getdb.getDB();

        //toArray() method is used to get the all documents in an array format
        return db.collection('products').find().toArray().then(
            products => {
                // console.log('prods: ', products);
                return products;
            }
        ).catch(
            err => console.log(err)
        );
    }

    static deleteById(productID) {

        const db = getdb.getDB();

        return db.collection('products').deleteOne(
            {_id: new mongoDB.ObjectId(productID)}
        );

    }

}

module.exports = Product;