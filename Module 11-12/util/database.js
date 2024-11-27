const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;

//for not creating multiple database instances we can simply create a single database
//connection variable which we can access from different parts of our application
//this is more clean way of interacting with the database

var _db;

const mongoConnect = callback => {
    MongoClient.connect(
        'mongodb+srv://aniruddhkarekar1:hHFdkybiuBDtiJBM@cluster0.2bhulxe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(
        client => {
            _db = client.db();
            callback();
        }
    )
    .catch(
        err => console.log(err)
    );
}

const getDB = () => {
    if(_db) {
        return _db;
    }
    throw 'No database connection is done';
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;