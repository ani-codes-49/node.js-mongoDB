const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product", //telling mongoose that this id belongs to the product and
          //we are linking this together in order to make a relation
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

User.methods.addToCart = function (product) {
  //the mongoose allows us to write custom methods
  //by using methods and assigning it to the "function () {}" which is necessary

  //lets see if we already have that product in the cart or not
  const existingProductIndex = this.cart.items.findIndex((cartProduct) => {
    //here we use only two equal signs as we need to check only values
    return cartProduct.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const existingProducts = [...this.cart.items]; // getting the existing cart
  //items so that we can work on it efficiently

  if (existingProductIndex >= 0) {
    // we will enter this block only if we have
    //existing products (similar to what we are adding)

    newQuantity = existingProducts[existingProductIndex].quantity + 1;
    existingProducts[existingProductIndex].quantity = newQuantity;
  } else {
    existingProducts.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = { items: existingProducts };
  this.cart = updatedCart;
  return this.save();
};

User.methods.deleteCartItem = function (productID) {
  const updatedCartItems = this.cart.items.filter((p) => {
    return p.productId.toString() !== productID.toString();
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

User.methods.clearCart = function () {
  this.cart = {
    items: [],
  };
  return this.save();
};

module.exports = mongoose.model("User", User);

// const mongoDB = require('mongodb');
// const dbConnection = require('../util/database');

// class User {

//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart; //cart = {items: []}
//         this._id = id;// getting the user id as we have to use it while updating the
//         //cart
//     }

//     save() {

//         const db = dbConnection.getDB();
//         return db.collection('users').insertOne(this);

//     }

//     addToCart(product) {

//
//     }

//     getCart() {

//         const db = dbConnection.getDB();
//         // console.log('inside cart', this.cart);
//         const productIDs = this.cart.items.map(
//             p => {
//                 return p.productID;
//             }
//         );

//         //we will return all the products and its quantity through this method
//         //for that first we need to get all the products which are in the cart
//         return db.collection('products').find({
//             _id: { $in: productIDs }
//         }).toArray().then(
//             products => {
//                 //now we have received all the products which are in the cart and db
//                 //now we also need to return the quantity field. For that:
//                 return products.map(
//                     p => {
//                         return {
//                             ...p, quantity: this.cart.items.find(
//                                 cp => {
//                                     return p._id.toString() === cp.productID.toString();
//                                 }
//                             ).quantity //we are returning quantity field by fetching
//                             //the products which are common in the cart and db
//                         }
//                     }
//                 );
//             }
//         )

//     }

//     deleteItem(productID) {
//         const db = dbConnection.getDB();
//         // console.log(this.cart);
//         const updatedCart = this.cart.items.filter(
//             p => {
//                 return (p.productID.toString() !== productID.toString());
//             }
//         );

//         return db.collection('users').updateOne({
//             _id: new mongoDB.ObjectId(this._id)
//         }, {
//             $set: {
//                 cart: {
//                     items: [...updatedCart]
//                 }
//             }
//         });
//     }

//     getOrders() {

//         const db = dbConnection.getDB();

//         return db.collection('orders')
//             .find({ 'user._id': new mongoDB.ObjectId(this._id) })
//             .toArray();

//     }

//     addOrder() {

//         const db = dbConnection.getDB();

//         return this.getCart().then(
//             products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new mongoDB.ObjectId(this._id),
//                         name: this.name
//                     }
//                 };
//                 return db.collection('orders').insertOne(order);
//             })
//             .then(
//                 result => {
//                     this.cart = { items: [] }; //we clear the cart after placing it into
//                     //the orders

//                     //now to also update it in the database
//                     return db.collection('users').updateOne({
//                         _id: new mongoDB.ObjectId(this._id)
//                     }, {
//                         $set: {
//                             cart: this.cart
//                         }
//                     });
//                 }
//             );

//     }

//     static findById(userID) {

//         const ObjectID = mongoDB.ObjectId;

//         const db = dbConnection.getDB();
//         return db.collection('users').find({ _id: new ObjectID(userID) }).next();

//     }
// }

// module.exports = User;
