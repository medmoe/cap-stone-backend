const express = require('express');
const router = express.Router();
//const  { User }= require('../db/models');
const models =require('../db/models');

// Express Routes for Users - Read more on routing at https://expressjs.com/en/guide/routing.html
// A route to fetch all users
router.get('/', async (req, res, next) => {
  try {
    const allUsers = await models.User.findAll();
    // An if/ternary statement to handle not finding allPlayers explicitly
    !allUsers
      ? res.status(404).send('Users Listing is Not Found')
      : res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

// a route to register the user in our database
router.post('/register', async (req, res, next) => {
    try {
        console.log(JSON.stringify(req.body));
        /*const {firstName, lastName, email, password} = req.body;
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        })
        res.json(user);*/
    } catch (error) {
        console.log(error);
    }
})

//A route to fetch a single user
//need to make edit the followign code
router.get('/:id', (req, res, next) => {
    models.User.findByPk(req.params.id)
    .then(user => {
        if(!user)
        res.status(404)
        .json({
            message: "No such user found."           
        })
        
        res.status(200)
        .json({
            message: "user is found!",
            user
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
// A route to add a new user
router.post('/', (req, res, next) =>{
    models.User.create ({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    })
    .then(user => {
        res.status(200)
        .json({
            message: "User is created",
            user
        });
    })
    .catch(err => {
        res.status(400)
        .json({
            message: "Error, user is not created.",
            err
        });
    })

})
//a route to update a user
//same as the put method above to update a user but not working properly.
/*router.put('/:id', async (req, res, next) => {
    try {
        const user=await models.User.findByPk(req.params.id)
        if (!user) {
            res.status(404).send('user not found');
            await user.update(req.body);
        }
            
    } catch (error) {
        next(error);
        
    }
}); 
*/



router.put('/:id', (req, res, next) =>{
    models.User.findByPk(req.params.id)
    .then(user => {
        if(!user )
        res.status(404)
        .json({
            message: "user not found"
        });

        user.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        user.save();

        res.status (200)
        .json({
            message: "user Info info are updated",
            user
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
    models.User.findByPk(req.params.id)
    .then (user => {
        if(!user)
        res.status(404)
        .json({
            message: "user is not found. "
        })
        user.destroy();

        res.status(200)
        .json({
            message:"user is deleted"
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
//latest copy of user routes
// Export our router, so that it can be imported to construct our api routes
module.exports = router;
