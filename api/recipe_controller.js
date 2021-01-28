const express =require('express');
const router =express.Router();
const { Recipe } = require('../db/models');
//const {default: Axios} =require('axios');

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
    Recipe.findAll()
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
router.get('/:name', async (req, res, next) => {
    try {
      const recipe = await Recipe.findOne({where: 
        { name: req.params.name },
          plain:true });
      // An if/ternary statement to handle not finding recipe explicitly
      !recipe
        ? res.status(404).send('Recipe Not Found') 
        //: res.status(200).json(recipe);
        :res.status(200).json({ message: "Recipe is found ", recipe});
    } catch (error) {
      next(error);
    }
  });


//A route to add a new recipe by recipe name
router.post('/add/:recipename', async (req, res, next) => {
    try {
      const newRecipe = await Recipe.findOrCreate({where: 
        { name: req.params.recipename },
        });
      // An if/ternary statement to handle not able to add the recipe explicitly
        !newRecipe
            ? res.status(404).send('Recipe is not created') 
            //: res.status(200).json(recipe);
            :res.status(200).json({ message: "Recipe is create ", newRecipe});
    } catch (error) {
            next(error);
    }
  });

//a route to update a recipe by recipe id 
router.put('/update/:id', async (req, res, next) => {
    try {
      const updatedRecipe = await Recipe.findByPk(req.params.id );
      // An if/ternary statement to handle not able to add the recipe explicitly
        !updatedRecipe
            ? res.status(404).send('No such recipe exists') 
            //: res.status(200).json(recipe);
            :deletedRecipe.destroy(); 
            res.status(200).json({ message: "Recipe is deleted"});
    } catch (error) {
            next(error);
    }
  });

//a route to update a recipe by recipe id
router.put ('/:id', (req, res, next) => {
    Recipe.findByPk(req.params.id)
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

//a route to delete a recipe by recipe name
router.delete('/delete/:recipename', async (req, res, next) => {
    try {
      const deletedRecipe = await Recipe.findOne(
          {where: 
            { name: req.params.recipename }
          });
      // An if/ternary statement to handle not able to add the recipe explicitly
        !deletedRecipe
            ? res.status(404).send('No such recipe exists') 
            //: res.status(200).json(recipe);
            :deletedRecipe.destroy(); 
            res.status(200).json({ message: "Recipe is deleted"});
    } catch (error) {
            next(error);
    }
  });

  //a route to delete a recipe by recipe id
  router.delete('/deletebyid/:id', async (req, res, next) => {
    try {
      const deletedRecipe = await Recipe.findByPk(req.params.id );
      // An if/ternary statement to handle not able to add the recipe explicitly
        !deletedRecipe
            ? res.status(404).send('No such recipe exists') 
            //: res.status(200).json(recipe);
            :deletedRecipe.destroy(); 
            res.status(200).json({ message: "Recipe is deleted"});
    } catch (error) {
            next(error);
    }
  });


module.exports = router;





