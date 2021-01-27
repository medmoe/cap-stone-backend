const Sequelize = require('sequelize');
const db = require('../db');

const Measurement_unit = db.define('measurement_unit', {
    measurement_description: {
        type: Sequelize.STRING,
        allowNull: false,
    }

})

module.exports = Measurement_unit;