const Sequelize = require('sequelize');

const sequel = require('../util/database');

const CartItem = sequel.define('cartItem', {

    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncremenmt: true,
        primaryKey: true,
    },
    quantity: Sequelize.INTEGER,

});

module.exports = CartItem;