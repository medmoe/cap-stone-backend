const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const  { User, Recipe }= require('../db/models');

// A route to fetch all users
router.get('/', async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
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
        const {firstName, lastName, email, password} = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        })
        console.log(user);
        res.json(user);
    } catch {
        res.status(500).send();
    }
})
// a route to log the user in
router.post('/login', async (req, res, next) => {     
        const {email, password} = req.body;
        const user = await User.findOne({ where: {
            email: email,
        }}) 
        if(!user){
            return res.status(400).send('Cannot find user');
        }
    try{
        if(await bcrypt.compare(password, user.password)){
            res.send('you logged in successfuly');
        }else{
            res.send("not allowed");
        }
    } catch (error) {
        console.log(error);
    }
})

//A route to fetch a single user by user email
router.get('/useremail/:email', async (req, res, next) => {
    try {
        const user = await User.findOne({where: 
            { email: req.params.email }
        });
        !user
            ? res.status(404).send('User Not Found') 
            : res.status(200).json({ message: "User is found ", user});
    } catch (error) {
      next(error);
    }
  });

//A route to fetch all recipes of a user by user email
router.get('/userallrecipes/:email', async (req, res, next) => {
    try {
        const user = await User.findOne({where: 
            { email: req.params.email },
                include: [{
                    model: Recipe
                }]
            })
        !user
            ? res.status(404).send('User Not Found') 
            : res.status(200).json({ message: "User is found ", user});
    } catch (error) {
      next(error);
    }
  });

//A route to fetch a single user by id
router.get('/userid/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk( req.params.id);
        !user
            ? res.status(404).send('User Not Found') 
            : res.status(200).json({ message: "User is found ", user});
    } catch (error) {
      next(error);
    }
  });

//A route to fetch all recipes associated with a user by user id
router.get('/useridallrecipes/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id,
           {include: Recipe })
            //{include: [{ model: Recipe}]})

        !user
            ? res.status(404).send('User Not Found') 
            : res.status(200).json({ message: "User is found ", user});
    } catch (error) {
      next(error);
    }
  }); 
  
//a route to update a user by email
router.put('/updateuser/:email', async (req, res, next) => {
    try {
        const updatedUser = await User.findOne({where: 
            { email: req.params.email }});
        !updatedUser
            ? res.status(404).send('No such user exists') 
            : (await updatedUser.update(req.body, {return: true}),
                res.status(200).json({ message: "User info is updated. ", updatedUser}));
    } catch (error) {
            next(error);
    }
  });

  //a route to update a user by id
router.put('/updatebyid/:id', async (req, res, next) => {
    try {
        const updatedUser = await User.findByPk(req.params.id, {return:true});
        !updatedUser
            ? res.status(404).send('No such user exists') 
            : (await updatedUser.update(req.body, {return: true}),
                res.status(200).json({ message: "User info is updated. ", updatedUser}));
    } catch (error) {
            next(error);
    }
  });


// A route to delete a user by email
router.delete('/delete/:email', async (req, res, next) => {
    try {
      const deletedUser = await User.findOne(
          {where: 
            { email: req.params.email }
          });
        !deletedUser
            ? res.status(404).send('No such user exists')
            : (await deletedUser.destroy(), 
                res.status(200).json({ message: "User is deleted"}));
    } catch (error) {
            next(error);
    }
  });
 
 // A route to delete a user by id
router.delete('/deletebyid/:id', async (req, res, next) => {
    try {
        const deletedUser = await User.findByPk(req.params.id);
        !deletedUser
            ? res.status(404).send('No such user exists')
            : (await deletedUser.destroy(), 
               res.status(200).json({ message: "User is deleted"}));
    } catch (error) {
            next(error);
    }
}); 

 // A route to delete a user's single recipe base on given recipe id and logged on user
 router.delete('/deletebyid/:id', async (req, res, next) => {
    try {
        const deletedUser = await User.findByPk(req.params.id);
        !deletedUser
            ? res.status(404).send('No such user exists')
            : (await deletedUser.destroy(), 
               res.status(200).json({ message: "User is deleted"}));
    } catch (error) {
            next(error);
    }
}); 

module.exports = router;
