const db = require('./db');

const { User } = require('./db/models');
const Recipe = require('./db/models/recipe');



const seedDatabase = async() => {
  await Promise.all([
   User.create({
    firstName: "Garry",
    lastName: "Mease",
    email: "gmease0@blogger.com",
    password: "WbVWdE"
   }),
   User.create({
    firstName: "Nappy",
    lastName: "Howley",
    email: "nhowley1@weebly.com",
    password: "uBMBBRc"
   }),
   User.create({
    firstName: "Annetta",
    lastName: "Cowe",
    email: "acowe2@alexa.com",
    password: "wE7FWfl2"
   }),
   User.create({
    firstName: "Clarine",
    lastName: "Fordham",
    email: "cfordham3@hubpages.com",
    password: "dmgWIJJ8JFAF"
   }),
   User.create({
    firstName: "Sofia",
    lastName: "Leaves",
    email: "sleaves4@blogspot.com",
    password: "oGulIieavr"
   }),
   Recipe.create({
    name: "Oriental Knight's-spur",
    description: "Suspendisse potenti. In eleifend quam a odio.  sollicitudin vitae, consectetuer eget, rutrum at, lorem."
   }),
   Recipe.create({
    name: "Resinleaf Brickellbush",
    description: "Maecenas tristique, est et tempus semper,ci lu posuere metus vitae ipsum. Aliquam non mauris."
   }),
   Recipe.create({
    name: "Rapp's Ramonia",
    description: "Integer ac leo. Pellentesque ultrices mitsuscipit ligula in lacus."
   }),
   Recipe.create({
    name: "Western Azalea",
    description: "Pellentesque at nulla. Suspendisse poturus eu magna vulputate luctus."
   }),
   Recipe.create({
    name: "Mexican Orange",
    description: "Duis aliquam convallis nunc. Proin e nonummy. Integer non velit."
   })
  ])
}

module.exports = seedDatabase;
