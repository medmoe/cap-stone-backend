const Sequelize = require('sequelize');
const db = require('../db');


const Ingredient = db.define('ingredient', {
    ingredient_name: {
        type: Sequelize.STRING,
        allowNull: false
    }

})

module.exports = Ingredient;