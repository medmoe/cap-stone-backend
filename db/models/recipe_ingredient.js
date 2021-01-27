const Sequelize = require('sequelize');
const db = require('../db');

const Recipe_Ingredient = db.define('recipe_ingredient', {
    recipe_id: {
        type: Sequelize.INTEGER,
        references: {
            model: "recipes",
            key: "id"
        }
    },
    ingredient_id: {
        type: Sequelize.INTEGER,
        references: {
            model: "ingredients",
            key: "id"
        }
    },
    measurement_qty_id: {
        type: Sequelize.INTEGER,
        references: {
            model: "measurement_qties",
            key: "id"
        }
    },
    measurement_unit_id: {
        type: Sequelize.INTEGER,
        references: {
            model: "measurement_units",
            key: "id"
        }
    }
})

module.exports = Recipe_Ingredient;