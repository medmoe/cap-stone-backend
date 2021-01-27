const User = require('./user');
const Recipe = require('./recipe');
const Ingredient = require('./ingredient');
const Measurement_qty = require('./measurement_qty');
const Measurement_unit = require('./measurement_unit');
const Recipe_Ingredient = require('./recipe_ingredient');

//ASSOICATIONS GO HERE -- Read more at https://sequelize.org/master/manual/assocs.html

User.belongsToMany(Recipe , {through: "user_recipe"});
Recipe.belongsToMany(User , {through: "user_recipe"});

module.exports = {
  User,
  Recipe,
  Ingredient,
  Measurement_unit,
  Measurement_qty,
  Recipe_Ingredient
};
