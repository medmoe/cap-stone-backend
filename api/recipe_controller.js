const express =require('express');
const router =express.Router();
const models =require('../db/models');
//const { Recipe } = require('../db/models');
const {default: Axios} =require('axios');
const API_KEY= "7e16571e4a5d4b7e88bb9317652f6767";
const RECIPE_API_URL= `https://api.spoonacular.com/recipes/complexSearch?query=udon&apiKey=${API_KEY}`;
//sample api link:
//https://api.spoonacular.com/recipes/complexSearch?query=pasta&apiKey=7e16571e4a5d4b7e88bb9317652f6767


//Route to serve up a recipe by query 
router.get("/search", async (req, res, next) => {
    //const {product } =req.params;
    let results =[];
        await Axios.get(RECIPE_API_URL)
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




//A route to fetch all recipes
router.get('/', (req, res, next) =>  {
    models.Recipe.findAll()
    .then(recipes => {
        res.status(200)
        .json({
            message: "Sucessfully find all recipes",
            recipes
        });
    })
    .catch(err => {
        res.status(404)
        .json({
            message: "error, unable to fetch recipes",
            err
        });
    });
});

//A route to fetch a single recipe
router.get('/:id', (req, res, next) => {
    models.Recipe.findByPk(req.params.id)
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





