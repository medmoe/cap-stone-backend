const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const db = require('../db');

const User = db.define('user', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.TEXT,
        
    }, 
    
})

module.exports = User;