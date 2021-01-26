const Sequelize = require('sequelize');
const db = require('../db');

const Recipe = db.define( 'recipe', {
        name:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
        type: Sequelize.STRING,
        allowNull: false,
        },
    });

module.exports = Recipe;
