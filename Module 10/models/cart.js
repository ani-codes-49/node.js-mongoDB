const Sequelize = require('sequelize');

const sequel = require('../util/database');

const Cart = sequel.define('cart', {

    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncremenmt: true,
        primaryKey: true,
    }

});

module.exports = Cart;