const express =require('express');
const router =express.Router();
const models =require('../db/models');
const request = require('request');
//const { Recipe } = require('../db/models');

const {default: Axios} =require('axios');

//const API_KEY= "7e16571e4a5d4b7e88bb9317652f6767";
const API_KEY= process.env.API_KEY;
//console.log(process.env);
const RECIPE_API_URL= `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=3&addRecipeInformation=true&query=`;

let rps = [];
let ingredients = [];
//if you want to find more recipes just add letters to the variable 'word'
let word = "abc";
for(let i = 0; i < word.length; i++){
        request(`https://www.themealdb.com/api/json/v1/1/search.php?f=${word.charAt(i)}`,  (error, response, body) =>{
                    if(error){
                        console.log(error);
                    }else{
                        JSON.parse(body).meals.forEach(element => {
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
                image: element.image,
            }
            //store the recipe object in recipes table
            let recipe = await models.Recipe.create(r);
            //a for loop to create ingredients objects for the recipe created
            for(let i = 0; i < element.ingredients.length; i++){
                let ing = {
                    ingredient_name: element.ingredients[i]
                }
                //store the ingredient object in the ingredients table
                let ingredient = await models.Ingredient.create(ing);
                //assossiate ingredients with recipes
                await recipe.addIngredient(ingredient);
            }
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
        //console.log("after axios");
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

//A route to fetch a single recipe
router.get('/:name', (req, res, next) => {
    models.Recipe.findByPk(req.params.name)
    .then(recipe => {
        if(!recipe)
        res.status(404)
        .json({
            message: "No such recipe found."           
        })
        
        res.status(200)
        .json({
            message: "Recipe is found!",
            recipe
        });
    })
    .catch (err => {
        res.status(500)
        .json({
            message: " An error has occured!",
            err
        })
    })
})
// A route to add a new recipe
router.post('/', (req, res, next) =>{
    models.Recipe.create ({
      name: req.body.name,
      //coudl add more column name depending on the table
      description: req.body.description
    })
    .then(recipe => {
        res.status(200)
        .json({
            message: "Recipe sucessfully created",
            recipe
        });
    })
    .catch(err => {
        res.status(404)
        .json({
            message: "Error, recipe is not created.",
            err
        });
    })

})
//a route to update a recipe 
router.put ('/:id', (req, res, next) => {
    models.Recipe.findByPk(req.params.id)
    .then(recipe => {
        if(!recipe )
        res.status(404)
        .json({
            message: "recipe not found"
        });

        recipe.update({
        name: req.body.name,
        description: req.body.description
        });

        recipe.save();

        res.status (200)
        .json({
            message: "Recipe is updated",
            recipe
        });            
    })
    .catch(err => {
        res.status(500)
        .json({
            message: " An erro has occured!",
            err
        });
    });
});

// A route to delete a recipe 
router.delete('/:id', (req, res, next) => {
    models.Recipe.findByPk(req.params.id)
    .then (recipe => {
        if(!recipe)
        res.status(404)
        .json({
            message: "Recipe is not found. "
        })
        recipe.destroy();

        res.status(200)
        .json({
            message:"Recipe is deleted"
        });
    })
    .catch(err => {
        res.status(500)
        .json({
            message: "An error has occured .",
            err
        });
    });
});

module.exports = router;





