const Sequelize = require('sequelize');

const sequel = require('../util/database');

const Order = sequel.define('order', {

    id: {
        type: Sequelize.INTEGER,
        autoIncremenmt: true,
        allowNull: false,
        primaryKey: true,
    }

});

module.exports = Order;