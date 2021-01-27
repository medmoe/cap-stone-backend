const Sequelize = require('sequelize');
const db = require('../db');

const Measurement_qty = db.define('measurement_qty', {
    qty_amount: {
        type: Sequelize.STRING,
        allowNull: false,
    }

})

module.exports = Measurement_qty;