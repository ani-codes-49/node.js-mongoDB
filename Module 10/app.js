const express = require('express');
const bodyParer = require('body-parser');
const path = require('path');
const root_dir = require('./util/root_path');
const sequel = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const admin = require('./routes/admin');
const user = require('./routes/shop');

const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.use(bodyParer.urlencoded({ extended: false }));
app.use(express.static(path.join(root_dir.rootPath, 'public')));

//defining a middleware for accepting incoming requests
//this middleware will always find a user present in the db

app.use((req, res, next) => {

    const user = User.findByPk(1).then(
        user => {
            //storing the user data in the request
            req.user = user;
            console.log(user);
            //calling the next() method so that we will continue the flow of execution
            next();
        }
    ).catch(
        err => console.log(err)
    );
});

app.use('/admin', admin.router);
app.use(user);

//for creating association, onDelete means when the User is deleted for the particular
//product then the product should also be deleted and vice versa

//two way connnection
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem }); // optional
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, {through: OrderItem});


// through argument is for the intermediate 
//tables that connects the main tables by primary keys

//force: true means the if the table is already created then we need to override it
//(not good in production)
sequel.sync(
    // { force: true }
).then(result => {
    return User.findByPk(1);
}).then(
    user => {
        //this block will only execute if we have an existing user
        if (!user) {
            return User.create({
                id: 1,
                name: 'Aniruddh',
                email: 'aniruddhkarekar.1@gmail.com'
            }
            );
        } else return Promise.resolve(user); // or simply return an existing user as user object
        //also returns a promise
    }
).then(user => {
    user.getCart(
        cart => {
            if(!cart) {
                return user.createCart({id: 2});
            } 
            return cart;
        }
    ).then().catch();
}
).then(
    res => {
        app.listen(5000);
    }
).catch(
    err => {
        console.log(err);
    }
);




