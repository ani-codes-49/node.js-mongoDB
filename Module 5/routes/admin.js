
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const rootDir = require('../utils/root_path');

const router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));

//this is middleware
//this is post method which will only listen to the post requests
router.post('/product', (req, res, next) => {
    
    // res.redirect('/');
    console.log('inside product.');
    
    // next(); //sends the program execution to the next middleware method()
    //If we dont write the next method and do not return the response then
    //the execution will stuck and nothing will happen 
});

//the use method is used to add a middleware method through which the program
//execution will pass
router.use('/add-product', (req, res, next) => {
    // res.write(req.body['title']);
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));

});


module.exports = router;