const Sequelize = require('sequelize');

const sequel = require('../util/database');

const Cart = sequel.define('cart', {

    id: {
        type: Sequelize.INTEGER,
        autoIncremenmt: true,
        allowNull: false,
        primaryKey: true,
    }

});

module.exports = Cart;