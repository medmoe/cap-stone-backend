const express =require('express');
const router =express.Router();
const models =require('../db/models');
//const { Recipe } = require('../db/models');
const {default: Axios} =require('axios');

const API_KEY= process.env.API_KEY;
const RECIPE_API_URL= `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=3&addRecipeInformation=true&query=`;

//Route to serve up a recipe by product search,
//result will includes image url, title, ingrediens and description (or summary)

router.get('/search/:product', async (req, res, next) => {
    const { product }=req.params;
    //console.log(req.params);
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

router.get('/:name', async (req, res, next) => {
    try {
      const recipe = await models.Recipe.findOne({where: 
        { name: req.params.name },
          plain:true });
      // An if/ternary statement to handle not finding recipe explicitly
      !recipe
        ? res.status(404).send('recipe Not Found')
        : res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  });
   
//A route to fetch a single recipe
/*router.get('/:id', (req, res, next) => {
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
*/


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





