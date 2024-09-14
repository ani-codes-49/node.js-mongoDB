const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userModel = Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: Object,
        default: 'New user',
    },
    posts: [
        {
            type: Schema.ObjectId,
            ref: 'posts'
        }
    ]
});

module.exports = mongoose.model('user', userModel);