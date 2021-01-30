const db = require('./db');

const { User, Recipe, Ingredient } = require('./db/models');
const request = require('request');

let rps = [];
//if you want to find more recipes just add letters to the variable 'word'
let word = "ab";
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
const seedDatabase = async() => {
  await Promise.all([
          rps.forEach((element) => {
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
              let recipe = Recipe.create(r);
          })
  ])
}

module.exports = seedDatabase;
