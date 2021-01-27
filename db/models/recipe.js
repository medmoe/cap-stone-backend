const Sequelize = require('sequelize');
const db = require('../db');

const Recipe = db.define( 'recipe', {
        name:{
            type: Sequelize.STRING,
            
        },
        description: {
            type: Sequelize.TEXT,
            
        },
        ingredients: {
            type: Sequelize.TEXT,
            
        },
        instructions: {
            type: Sequelize.TEXT,
            
        },
        cookingTime: {
            type: Sequelize.TEXT,
            
        },
        imageURL: {
            type: Sequelize.TEXT,
            
        }
    });

module.exports = Recipe;
