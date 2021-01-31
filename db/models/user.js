const Sequelize = require('sequelize');

const db = require('../db');

const User = db.define('user', {
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
    },
    password: {
        type: Sequelize.TEXT,
        
    },
    session_id:{
        type: Sequelize.STRING,
        unique: true
    } 
    
})

module.exports = User;