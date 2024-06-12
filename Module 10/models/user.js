const Sequelize = require('sequelize');

const sequel = require('../util/database');

const User = sequel.define('user', {

    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },

    name: Sequelize.STRING,
    email: Sequelize.STRING

});

module.exports = User;