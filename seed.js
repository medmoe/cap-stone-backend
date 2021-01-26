const db = require('./db');

const { User } = require('./db/models');



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
   })
  ]);
}

module.exports = seedDatabase;
