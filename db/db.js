const Sequelize = require("sequelize");
const { name } = require("../package.json");

// Initialize database with Sequelize . put your username and password for database
const db = new Sequelize(
	process.env.DATABASE_URL,
	{
		dialect: 'postgres',
		protocol: 'postgres',
		dialectOptions: {
			ssl: {
				sslmode: 'require',
				rejectUnauthorized: false
			}
		}
	}
);

module.exports = db;
