const Player = require('./player');
const User = require('./user');
const Recipe = require('./recipe');

//ASSOICATIONS GO HERE -- Read more at https://sequelize.org/master/manual/assocs.html

User.belongsToMany(Recipe , {through: "user_recipe"});
Recipe.belongsToMany(User , {through: "user_recipe"});

module.exports = {
  Player,
  User,
  Recipe
};
