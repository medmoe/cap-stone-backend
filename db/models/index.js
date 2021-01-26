const Player = require('./player');
const User = require('./user');
const Recipe = require('./recipe');

//ASSOICATIONS GO HERE -- Read more at https://sequelize.org/master/manual/assocs.html

User.hasMany(Recipe);
Recipe.belongsTo(User);

module.exports = {
  Player,
  User,
  Recipe
};
