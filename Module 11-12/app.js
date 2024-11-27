const express = require('express');
const bodyParer = require('body-parser');
const path = require('path');
const root_dir = require('./util/root_path');

const mongoConnect = require('./util/database').mongoConnect;

const app = express();

const admin = require('./routes/admin');
const user = require('./routes/shop');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParer.urlencoded({ extended: false }));
app.use(express.static(path.join(root_dir.rootPath, 'public')));

app.use((req, res, next) => {

    const user = User.findById('666fe4010b09bb7e57dc7c49').then(
        user => {
            //storing the user data in the request so that we can access the user
            //object and its associated data from anywhere in the app

            //here we instantiate the new user object so that we can use all its methods
            //and
            // console.log(user._id);
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
            // console.log(user);
            //calling the next() method so that we will continue the flow of execution
        }
    ).catch(
        err => console.log(err)
    );
});


app.use('/admin', admin.router);
app.use(user.router);

app.use('', (req, res, next) => {
    res.render('error.ejs', {
        pageTitle: 'Page not found',
        path: '/page-not-found'
    });
});

mongoConnect(() => {
    console.log('connected');
    app.listen(9000);
});



