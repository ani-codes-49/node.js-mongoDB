const Sequelize = require('sequelize');

const sequel = require('../util/database');

const OrderItem = sequel.define('orderItem', {

    id: {
        type: Sequelize.INTEGER,
        autoIncremenmt: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: Sequelize.INTEGER,

});

module.exports = OrderItem;