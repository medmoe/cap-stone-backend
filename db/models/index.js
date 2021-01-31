const User = require('./user');
const Recipe = require('./recipe');

User.belongsToMany(Recipe , {through: "user_recipe", foreignKey: "user_id"});
Recipe.belongsToMany(User , {through: "user_recipe", foreignKey: "recipe_id"});

module.exports = {
  User,
  Recipe,
};
