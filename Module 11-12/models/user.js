const mongoDB = require('mongodb');
const dbConnection = require('../util/database');

class User {

    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart; //cart = {items: []}
        this._id = id;// getting the user id as we have to use it while updating the
        //cart
    }

    save() {

        const db = dbConnection.getDB();
        return db.collection('users').insertOne(this);

    }

    addToCart(product) {

        const db = dbConnection.getDB();
        console.log(this.cart);
        //lets see if we already have that product in the cart or not
        const existingProductIndex = this.cart.items.findIndex(
            cartProduct => {
                //here we use only two equal signs as we need to check only values
                return (cartProduct.productID.toString() === product._id.toString());
            }
        );

        let newQuantity = 1;
        const existingProducts = [...this.cart.items]; // getting the existing cart
        //items so that we can work on it efficiently

        if (existingProductIndex >= 0) { // we will enter this block only if we have 
            //existing products (similar to what we are adding)

            newQuantity = existingProducts[existingProductIndex].quantity + 1;
            existingProducts[existingProductIndex].quantity = newQuantity;

        } else {
            existingProducts.push({
                productID: new mongoDB.ObjectId(product._id),
                quantity: newQuantity,
            });
        }

        const updatedCart = { items: existingProducts };
        return db.collection('users').updateOne(
            { _id: new mongoDB.ObjectId(this._id) }, {
            $set: {
                cart: updatedCart
            }
        }
        );
    }

    getCart() {

        const db = dbConnection.getDB();
        // console.log('inside cart', this.cart);
        const productIDs = this.cart.items.map(
            p => {
                return p.productID;
            }
        );

        //we will return all the products and its quantity through this method
        //for that first we need to get all the products which are in the cart
        return db.collection('products').find({
            _id: { $in: productIDs }
        }).toArray().then(
            products => {
                //now we have received all the products which are in the cart and db
                //now we also need to return the quantity field. For that:
                return products.map(
                    p => {
                        return {
                            ...p, quantity: this.cart.items.find(
                                cp => {
                                    return p._id.toString() === cp.productID.toString();
                                }
                            ).quantity //we are returning quantity field by fetching
                            //the products which are common in the cart and db
                        }
                    }
                );
            }
        )

    }

    deleteItem(productID) {
        const db = dbConnection.getDB();
        // console.log(this.cart);
        const updatedCart = this.cart.items.filter(
            p => {
                return (p.productID.toString() !== productID.toString());
            }
        );


        return db.collection('users').updateOne({
            _id: new mongoDB.ObjectId(this._id)
        }, {
            $set: {
                cart: {
                    items: [...updatedCart]
                }
            }
        });
    }

    getOrders() {

        const db = dbConnection.getDB();

        return db.collection('orders')
            .find({ 'user._id': new mongoDB.ObjectId(this._id) })
            .toArray();

    }

    addOrder() {

        const db = dbConnection.getDB();

        return this.getCart().then(
            products => {
                const order = {
                    items: products,
                    user: {
                        _id: new mongoDB.ObjectId(this._id),
                        name: this.name
                    }
                };
                return db.collection('orders').insertOne(order);
            })
            .then(
                result => {
                    this.cart = { items: [] }; //we clear the cart after placing it into 
                    //the orders

                    //now to also update it in the database
                    return db.collection('users').updateOne({
                        _id: new mongoDB.ObjectId(this._id)
                    }, {
                        $set: {
                            cart: this.cart
                        }
                    });
                }
            );

    }

    static findById(userID) {

        const ObjectID = mongoDB.ObjectId;

        const db = dbConnection.getDB();
        return db.collection('users').find({ _id: new ObjectID(userID) }).next();

    }
}

module.exports = User;