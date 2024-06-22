const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//although mongodb is schemaless but, we need to tell mongoose how our database structure
//will be and how the data types of each variables (schema) will be so that later
//mongoose can provide us with efficient methods so that we need not to worry about
//the internal stuff

const Product = Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', //adding a reference for constructing relation
        required: true
    }
});

//we need to export the mongoose.model() becaues mongoose works with model 
//and we have to specify the model name and the schema in the model method
module.exports = mongoose.model('Product', Product);
