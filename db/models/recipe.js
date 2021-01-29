const Sequelize = require('sequelize');
const db = require('../db');

const Recipe = db.define( 'recipe', {
        name:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        category: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        area: {
            type: Sequelize.TEXT,
            allowNull:false
        },
        instructions: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        all_ingredients: {
            //type: Sequelize.ARRAY(Sequelize.TEXT),
            type: Sequelize.TEXT,
            allowNull: false
            //type: Sequelize.ARRAY(Sequelize.TEXT)    

        },
        image: {
            type: Sequelize.STRING,
        }
    });

module.exports = Recipe;
