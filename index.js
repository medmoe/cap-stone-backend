//NODE MODULES
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
//const axios =require('axios');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const models = require('./db/models');
const session = require('express-session');


require('dotenv').config();


//IMPORTS/VARIABLES
const PORT = process.env.PORT || 8080;
const db = require('./db');
const app = express();

//UTILITIES 
const seedDatabase = require('./seed.js');

//CORS!
const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(
	session({
		key: "id",
		secret: "subscribe",
		resave: false,
		saveUninitialized: false,
	})
);


//BODY PARSER
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));

//Mount on API
app.use('/api', require('./api'));



// Error handling;
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  }
  else {
    next();
  }
});

//START BACKEND SERVER FUNCTIOON
const serverRun = () => {
  const server = app.listen(PORT, () => {
    console.log(`Live on port : ${PORT}`);
  });
};
//DB Sync Function
//Optional parameters
// {force:true} - drops current tables and places new empty tables
//{alter:true} - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.

//check if the database is connected
db.authenticate()
  .then(() => {
    console.log("database is connected");
    // fetch recipes by first letter and store them in database
  })
  .catch(error => console.log(error));
  
const syncDb = () => {
  
  if (process.env.NODE_ENV === 'production') {
    db.sync();
	  seedDatabase();
  }
  else {
    console.log('As a reminder, the forced synchronization option is on');
    db.sync({ force: true })
      .then(() => seedDatabase())
      .catch(err => {
        if (err.name === 'SequelizeConnectionError') {
          console.log(err.name);
        }
        else {
          console.log(err);
        }
      });
    }
};
//Run server and sync DB
syncDb();
let rps = [];
//if you want to find more recipes just add letters to the variable 'word'
let word = "abc";
for (let i = 0; i < word.length; i++) {
    request(`https://www.themealdb.com/api/json/v1/1/search.php?f=${word.charAt(i)}`, (error, response, body) => {
        if (error) {
            console.log(error);
        } else {
            JSON.parse(body).meals.forEach(element => {
                let ingredients = [];
                let { strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9 } = element;
                ingredients.push(strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9);
                let recipe = {
                    name: element.strMeal,
                    category: element.strCategory,
                    area: element.strArea,
                    instructions: element.strInstructions,
                    image: element.strMealThumb,
                    ingredients: ingredients
                }

                rps.push(recipe);
            })

        }
    });
}
          rps.forEach(async (element) => {
              //create a recipe object
              let r = {
                  name: element.name,
                  category: element.category,
                  area: element.area,
                  instructions: element.instructions,
                  all_ingredients: element.ingredients.join(','),
                  image: element.image,
              }
              //store the recipe object in recipes table
              let recipe = await Recipe.create(r);
          })
          
serverRun();

module.exports = app;
