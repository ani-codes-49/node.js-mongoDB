const express = require('express');

const app = express();

// app.use((req, res, next) => {

//     console.log('Hello from first middleware');
//     next();

// });

// app.use((req, res, next) => {
//     console.log('Hello from second middleware');
//     res.send('<h1> This response is generated from the second middleware function');
// });

app.use('/users', (req, res, next) => {

    console.log('Hello from first middleware');
    res.send('<h1>This is users page</h1>');

});

app.use('/', (req, res, next) => {
    console.log('Hello from second middleware');
    res.send('<h1> This is "/" page');
});


app.listen(3000);