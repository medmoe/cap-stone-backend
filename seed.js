const db = require('./db');

const { User, Recipe, Ingredient } = require('./db/models');


const seedDatabase = async() => {
  await Promise.all([
  
  //  Recipe.create({
  //   name: "Oriental Knight's-spur",
  //   description: "Suspendisse potenti. In eleifend quam a odio.  sollicitudin vitae, consectetuer eget, rutrum at, lorem."
  //  }),
  //  Recipe.create({
  //   name: "Resinleaf Brickellbush",
  //   description: "Maecenas tristique, est et tempus semper,ci lu posuere metus vitae ipsum. Aliquam non mauris.",
  //   ingredients: "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
  //   instruction: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.",
  //   cookingTime: "14",
  //   imageURL: "http://t-online.de/sapien.xml?a=penatibus&odio=et&in=magnis&hac", 
  // }),

  //  Recipe.create({
  //   name: "Rapp's Ramonia",
  //   description: "Integer ac leo. Pellentesque ultrices mitsuscipit ligula in lacus.",
  //   ingredients: "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
  //   instruction: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.",
  //   cookingTime: "14",
  //   imageURL: "http://t-online.de/sapien.xml?a=penatibus&odio=et&in=magnis&hac", 
  //  }),
  //  Recipe.create({
  //   name: "Western Azalea",
  //   description: "Pellentesque at nulla. Suspendisse poturus eu magna vulputate luctus.",
  //   ingredients: "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
  //   instruction: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.",
  //   cookingTime: "14",
  //   imageURL: "http://t-online.de/sapien.xml?a=penatibus&odio=et&in=magnis&hac", 
  //  }),
  //  Recipe.create({
  //   name: "Mexican Orange",
  //   description: "Duis aliquam convallis nunc. Proin e nonummy. Integer non velit.",
  //   ingredients: "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
  //   instruction: "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus.",
  //   cookingTime: "14",
  //   imageURL: "http://t-online.de/sapien.xml?a=penatibus&odio=et&in=magnis&hac", 
  //  }),
  ])
}

module.exports = seedDatabase;
