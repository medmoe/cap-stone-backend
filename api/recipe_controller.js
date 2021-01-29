const express =require('express');
const router =express.Router();

const { Recipe, User } = require('../db/models');
const db = require('../db/db');
const Sequelize = require('sequelize');
//const {default: Axios} =require('axios');


const models =require('../db/models');
const request = require('request');
//const { Recipe } = require('../db/models');


const API_KEY= process.env.API_KEY;
const RECIPE_API_URL= `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=3&addRecipeInformation=true&query=`;


let rps = [];
;
//if you want to find more recipes just add letters to the variable 'word'
let word = "a";
for(let i = 0; i < word.length; i++){
        request(`https://www.themealdb.com/api/json/v1/1/search.php?f=${word.charAt(i)}`,  (error, response, body) =>{
                    if(error){
                        console.log(error);
                    }else{
                        JSON.parse(body).meals.forEach(element => {
                            let ingredients = [];
                            let {strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9} = element;
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
router.post('/', (req, res, next) => {
    try{
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
            let recipe = await models.Recipe.create(r);
        })
        
        res.status(200).send();
        
    }catch (error){
        console.log(error);
    }
    
})


//Route to serve up a recipe by product search,
//result will includes image url, title, ingrediens and description (or summary)
router.get('/search/:product', async (req, res, next) => {
    const { product }=req.params;
    console.log(req.params);
    let results =[];
        await Axios.get(`${RECIPE_API_URL}${product}`)
        .then((getResult) => getResult.data.results)
        .then ((response) => {
            results =response;

        }) .catch((error) => console.error(error));
       
    try {
        res.status (200).json (results);
   }catch (error) {
       next(error);
   }   
});
////A route to fetch all recipes
router.get('/', async (req, res, next) => {
    try {
        let query = "select * from recipes INNER JOIN recipe_ingredient ON recipes.id = recipe_ingredient.recipe_id INNER JOIN ingredients ON recipe_ingredient.ingredient_id = ingredients.id;"
        const allRecipes = await db.query(query);
        //const allRecipes = await Recipe.findAll();
        !allRecipes
            ? res.status(404).send('Recipe Listings is Not Found')
            : res.status(200).json({message: "Here are the recipe listings ", allRecipes});
    } catch (error) {
      next(error);
    }
  });
 
//A route to fetch a single recipe by recipe name
router.get('/recipename/:name', async (req, res, next) => {
    try {
        const recipe = await Recipe.findOne({where: 
            { name: req.params.name }});
       !recipe
            ? res.status(404).send('Recipe is not found.') 
            :res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  });

  //A route to fetch a single recipe by recipe id
  router.get('/recipeid/:id', async (req, res, next) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        !recipe
            ? res.status(404).send('Recipe Not Found') 
            :res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  });


//A route to add a new recipe by recipe name
router.post('/add/:name', async (req, res, next) => {
    try {
        const newRecipe = await Recipe.findOrCreate({where: 
            {name: req.params.name,
             description: req.body.description,
             ingredient: req.body.ingredient,
             instructions: req.body.instructions,
             cookingTime: req.body.cookingTime,
             imageURL: req.body.imageURL },
        })


        const [ result, created ] = newRecipe;
        !created
            ? res.status(404).send({message: "Recipe not added, already exists in the database", newRecipe})
            : res.status(200).json({ message: "Recipe is added ", newRecipe}); 

    } catch (error) {
            next(error);
    }
  });

//a route to update a recipe by recipe id 
router.put('/update/:id', async (req, res, next) => {
    try {
        const updatedRecipe = await Recipe.findByPk(req.params.id );
        !updatedRecipe
            ? res.status(404).send('No such recipe exists') 
            : (await updatedRecipe.update(req.body, {return: true}),
                res.status(200).json({ message: "Recipe info is updated. ", updatedRecipe}));
    } catch (error) {
            next(error);
    }
  });

  //a route to update a recipe by recipe name
router.put('/updaterecipe/:name', async (req, res, next) => {
    try {
        const updatedRecipe = await Recipe.findOne({where: 
            { name: req.params.name }});
        !updatedRecipe
            ? res.status(404).send('No such recipe exists') 
            : (await updatedRecipe.update(req.body, {return: true}),
                res.status(200).json({ message: "Recipe info is updated. ", updatedRecipe}));
    } catch (error) {
            next(error);
    }
  });

//a route to delete a recipe by recipe name
router.delete('/delete/:name', async (req, res, next) => {
    try {
        const deletedRecipe = await Recipe.findOne(
            {where: 
                { name: req.params.name }
            });
        !deletedRecipe
            ? res.status(404).send('No such recipe exists')
            : (await deletedRecipe.destroy(), 
                res.status(200).json({ message: "Recipe is deleted"}));
    } catch (error) {
            next(error);
    }
  });

  //a route to delete a recipe by recipe id
  router.delete('/deletebyid/:id', async (req, res, next) => {
    try {
      const deletedRecipe = await Recipe.findByPk(req.params.id);
      !deletedRecipe
        ? res.status(404).send('No such recipe exists') 
        : (deletedRecipe.destroy(), 
            res.status(200).json({ message: "Recipe is deleted"}));
    } catch (error) {
            next(error);
    }
  });


module.exports = router;





