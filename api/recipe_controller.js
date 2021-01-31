const express = require("express");
const router = express.Router();

const { Recipe, User } = require("../db/models");
const db = require("../db/db");
const Sequelize = require("sequelize");

const models = require("../db/models");
const request = require("request");

////A route to fetch all recipes
router.get("/", async (req, res, next) => {
	try {
		//let query = "select * from recipes INNER JOIN recipe_ingredient ON recipes.id = recipe_ingredient.recipe_id INNER JOIN ingredients ON recipe_ingredient.ingredient_id = ingredients.id;"
		//const allRecipes = await db.query(query);
		const allRecipes = await Recipe.findAll();
		!allRecipes
			? res.status(404).send("Recipe Listings is Not Found")
			: res
					.status(200)
					.json({ message: "Here are the recipe listings ", allRecipes });
	} catch (error) {
		next(error);
	}
});

//A route to fetch a single recipe by recipe name
router.get("/recipename/:name", async (req, res, next) => {
	try {
		const recipe = await Recipe.findOne({
			where: { name: req.params.name },
		});
		!recipe
			? res.status(404).send("Recipe is not found.")
			: res.status(200).json(recipe);
	} catch (error) {
		next(error);
	}
});

//A route to fetch a single recipe by recipe id
router.get("/recipeid/:id", async (req, res, next) => {
	try {
		const recipe = await Recipe.findByPk(req.params.id);
		!recipe
			? res.status(404).send("Recipe Not Found")
			: res.status(200).json(recipe);
	} catch (error) {
		next(error);
	}
});

//A ROUTE TO SEARCH MULTIPLE RECIPES BY CATEGORY
router.get("/recipecategory/:category", async (req, res, next) => {
	try {
		const recipe = await Recipe.findAll({
			where: { category: req.params.category },
		});
		!recipe
			? res.status(404).send("Category does not exist")
			: res.status(200).json(recipe);
	} catch (error) {
		next(error);
	}
});

//A ROUTE TO SEARCH MULTIPLE RECIPES BY AREA
router.get("/recipearea/:area", async (req, res, next) => {
	try {
		const recipe = await Recipe.findAll({
			where: { area: req.params.area },
		});
		!recipe
			? res.status(404).send("Area does not exist")
			: res.status(200).json(recipe);
	} catch (error) {
		next(error);
	}
});

//A route to add a new recipe based on given recipe name
router.post("/add/:name", async (req, res, next) => {
	try {
		const { all_ingredients } = req.body;
		console.log(req.body);
		//console.log(typeof all_ingredients);
		const ingredientValue = Object.values(all_ingredients);
		//console.log (ingredientValue );
		const ingredientString = ingredientValue.join(",");

		const newRecipe = await Recipe.findOrCreate({
			where: {
				name: req.params.name,
				category: req.body.category,
				area: req.body.area,
				instructions: req.body.instructions,
				all_ingredients: ingredientString,
				//all_ingredients: req.body.all_ingredients,
				//all_ingredients: ingredientValue,
				image: req.body.image,
			},
		});
		const [result, created] = newRecipe;
		!created
		? res.status(404).send({ message: "Recipe not added, already exists in the database" })
		: res.status(200).json({ message: "Recipe is added ", newRecipe });

		const currentUser = await User.findOne({
			where: {
				email: req.body.email,
			},
		});
		const addedRecipe = await currentUser.addRecipe(result);
		//res.json(addedRecipe);

		!addedRecipe
			? res.status(404).send("Unable to add recipe")
			: res.status(200).json({ message: "Recipe info is updated. ", addedRecipe });
	} catch (error) {
		next(error);
	}
});

//a route to add a favorit recipe
router.post("/add-to-favorite/:id", async (req, res, next) => {
    console.log("this is body ", req.body);
	try {
		const recipe = await Recipe.findOrCreate({
			where: {
                id: req.params.id,
			},
        });
        const [resultObj, isCreated] = recipe
		console.log(req.body);
		const user = await User.findOne({
			where: {
				email: req.body.email,
			},
		});
		if (!user) {
			res.send("user account not found cannot add to favorite");
		} else {
			await user.addRecipe(resultObj);
			res.status(200).send("you add the recipe to your favorites successfuly");
		}
	} catch (error) {
		console.log(error);
	}
});

//a route to update a recipe by recipe id
router.put("/update/:id", async (req, res, next) => {
	// if the user is not logged in , send a forbidden mesaage
	if (!user) {
		res.status(403).send("User is not currently logged in.");
	} else {
		try {
			const updatedRecipe = await Recipe.findByPk(req.params.id);
			!updatedRecipe
				? res.status(404).send("No such recipe exists")
				: (await updatedRecipe.update(req.body, { return: true }),
				  res
						.status(200)
						.json({ message: "Recipe info is updated. ", updatedRecipe }));
		} catch (error) {
			next(error);
		}
	}
});

//a route to update a recipe by recipe name
router.put("/updaterecipe/:name", async (req, res, next) => {
	// if the user is not logged in , send a forbidden mesaage
	if (!user) {
		res.status(403).send("User is not currently logged in.");
	} else {
		try {
			const updatedRecipe = await Recipe.findOne({
				where: { name: req.params.name },
			});
			!updatedRecipe
				? res.status(404).send("No such recipe exists")
				: (await updatedRecipe.update(req.body, { return: true }),
				  res
						.status(200)
						.json({ message: "Recipe info is updated. ", updatedRecipe }));
		} catch (error) {
			next(error);
		}
	}
});

//a route to delete a recipe by recipe name

router.delete("/delete/:name", async (req, res, next) => {
	// if the user is not logged in , send a forbidden mesaage
	if (!user) {
		res.status(403).send("User is not currently logged in.");
	} else {
		try {
			const deletedRecipe = await Recipe.findOne({
				where: { name: req.params.name },
			});
			!deletedRecipe
				? res.status(404).send("No such recipe exists")
				: (await deletedRecipe.destroy(),
				  res.status(200).json({ message: "Recipe is deleted. " }));
		} catch (error) {
			next(error);
		}
	}
});

//a route to delete a recipe by recipe id
router.delete("/deletebyid/:id", async (req, res, next) => {
	// if the user is not logged in , send a forbidden mesaage
	if (!user) {
		res.status(403).send("User is not currently logged in.");
	} else {
		try {
			const deletedRecipe = await Recipe.findByPk(req.params.id);
			!deletedRecipe
				? res.status(404).send("No such recipe exists")
				: (deletedRecipe.destroy(),
				  res.status(200).json({ message: "Recipe is deleted" }));
		} catch (error) {
			next(error);
		}
	}
});

//most updated copy
module.exports = router;
