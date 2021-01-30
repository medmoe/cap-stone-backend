const User = require('./user');
const Recipe = require('./recipe');

//ASSOICATIONS GO HERE -- Read more at https://sequelize.org/master/manual/assocs.html

User.belongsToMany(Recipe , {through: "user_recipe", foreignKey: "user_id"});
Recipe.belongsToMany(User , {through: "user_recipe", foreignKey: "recipe_id"});




module.exports = {
  User,
  Recipe,
};
