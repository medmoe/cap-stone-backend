const Sequelize = require('sequelize');
const { name } = require('../package.json');

// Initialize database with Sequelize . put your username and password for database
const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://postgres:12345@localhost:5432/${name}`,
  {
    logging: false,
  }
);

module.exports = db;