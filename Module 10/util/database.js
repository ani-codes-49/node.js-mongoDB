const Sequelize = require('sequelize');

const sequel = new Sequelize(
    'new_schema',
    'root',
    'admin123',
    {
        dialect: 'mysql',
        host: 'localhost',
    }
);

module.exports = sequel;