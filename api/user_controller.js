const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { User, Recipe } = require('../db/models');
const db = require('../db/db');
const Sequelize = require('sequelize');
const { DatabaseError } = require('sequelize');

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





// router.get("/login/:session_id", async (req, res) => {
//   let query = "SELECT users.first_name, users.last_name, users.session_id, recipes.name, recipes.category, recipes.area, recipes.instructions, recipes.all_ingredients, recipes.image FROM users INNER JOIN user_recipe ON users.session_id=:session_id AND users.id=user_recipe.user_id INNER JOIN recipes ON user_recipe.recipe_id=recipes.id;"
//   const recipes = await db.query(query, {
//     replacements: {session_id: req.params.session_id},
//     type: Sequelize.QueryTypes.SELECT
//   })

//   let query2 = " SELECT * FROM users WHERE users.session_id=:sessionid";
//   const user = await db.query(query2, {
//     replacements: {sessionid: req.params.session_id},
//     type: Sequelize.QueryTypes.SELECT
//   })
// 	if (user) {
//     console.log("im here");
//     console.log(user);
// 		res.send({ loggedIn: true, user: req.session.user, info: recipes });
// 	} else {
// 		res.send({ loggedIn: false });
// 	}
// });
// router.get("/login/:session_id", async (req, res) => {
//   console.log(req.params.session_id);
//   if (req.params.session_id === null) {
//       // let query =
//       //     "SELECT users.first_name, users.last_name, users.session_id, recipes.name, recipes.category, recipes.area, recipes.instructions, recipes.all_ingredients, recipes.image FROM users INNER JOIN user_recipe ON users.session_id=:session_id AND users.id=user_recipe.user_id INNER JOIN recipes ON user_recipe.recipe_id=recipes.id;";
//       // const recipes = await db.query(query, {
//       //     replacements: { session_id: req.params.session_id },
//       //     type: Sequelize.QueryTypes.SELECT,
//       // });
//       console.log("good");
//       res.send("bad");
//   } else {
//       console.log("here");
//       const user = await User.findOne({
//           where: {
//               session_id: req.params.session_id,
//           },
//       });
//       if (user) {
//           console.log(user);
//           res.send({ loggedIn: true, user: user });
//       } else {
//           res.send({ loggedIn: false });
//       }
//   }

  // let query2 = " SELECT * FROM users WHERE users.session_id=:sessionid";
  // const user = await db.query(query2, {
  //     replacements: { sessionid: req.params.session_id },
  //     type: Sequelize.QueryTypes.SELECT,
  // });
// });











router.get("/login/:session_id", async (req, res) => {
  console.log(req.params.session_id);
  if (req.params.session_id === null) {
      // let query =
      //     "SELECT users.first_name, users.last_name, users.session_id, recipes.name, recipes.category, recipes.area, recipes.instructions, recipes.all_ingredients, recipes.image FROM users INNER JOIN user_recipe ON users.session_id=:session_id AND users.id=user_recipe.user_id INNER JOIN recipes ON user_recipe.recipe_id=recipes.id;";
      // const recipes = await db.query(query, {
      //     replacements: { session_id: req.params.session_id },
      //     type: Sequelize.QueryTypes.SELECT,
      // });
      console.log("good");
      res.send("bad");
  } else {
      console.log("here");
      const user = await User.findOne({
          where: {
              session_id: req.params.session_id,
          },
      });
      console.log(user);
      if (user) {
          console.log(user);
          res.send({ loggedIn: true, user: user });
      } else {
          res.send({ loggedIn: false });
      }
  }
});

  // let query2 = " SELECT * FROM users WHERE users.session_id=:sessionid";
  // const user = await db.query(query2, {
  //     replacements: { sessionid: req.params.session_id },
  //     type: Sequelize.QueryTypes.SELECT,
  // });

// router.post("/login", async (req, res, next) => {
// 	const { email, password } = req.body;
// 	const user = await models.User.findOne({
// 		where: {
// 			email: email,
// 		},
// 	});

// 	if (!user) {
// 		return res.status(400).send("Cannot find user");
// 	}
// 	try {
// 		if (await bcrypt.compare(password, user.password)) {
// 			req.session.user = user;
// 			req.session.save();
// 			console.log(req.sessionID);
// 			res.send({ loggedIn: true, user: req.session.user });
// 		} else {
// 			res.send("not allowed");
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// });

router.post("/register", async (req, res, next) => {
  try {
      const { first_name, last_name, email, password } = req.body;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          session_id: req.sessionID,
          password: hashedPassword,
      });
      console.log("new user", user);
      const newUser = {
          first_name,
          last_name,
          email,
      };


      res.send({
          loggedIn: true,
          user: newUser,
          sessionID: req.sessionID,
      });
  } catch {
      res.status(500).send();
  }
});
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
      where: {
          email: email,
      },
  });

  if (!user) {
      return res.status(400).send("Cannot find user");
  }
  try {
      if (await bcrypt.compare(password, user.password)) {
          req.session.user = user;
          req.session.save();
          //add session id to database
          let query = "update users set session_id=:session where id =:userid";
          const users = await db.query(query, {
              replacements: { userid: user.dataValues.id, session: req.sessionID },
              type: Sequelize.QueryTypes.UPDATE,
          });
          res.send({
              loggedIn: true,
              user: req.session.user,
              sessionID: req.sessionID,
          });
      } else {
          res.send("not allowed");
      }
  } catch (error) {
      console.log(error);
  }
});

//a route to register the user in our database
// router.post('/register', async (req, res, next) => {
//     try {
//         const {first_name, last_name, email, password} = req.body;
//         const salt = await bcrypt.genSalt();
//         const hashedPassword = await bcrypt.hash(password, salt);
//         const user = await User.create({
//             first_name: first_name,
//             last_name: last_name,
//             email: email,
//             password: hashedPassword
//         })
//         res.json(user);
//     } catch {
//         res.status(500).send();
//     }
// })
// router.post("/login", async (req, res, next) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({
//       where: {
//           email: email,
//       },
//   });

//   if (!user) {
//       return res.status(400).send("Cannot find user");
//   }
//   try {
//       if (await bcrypt.compare(password, user.password)) {
//           req.session.user = user;
//           req.session.save();
//           //add session id to database
//           let query = "update users set session_id=:session where id =:userid";
//           const users = await db.query(query, {
//               replacements: { userid: user.dataValues.id, session: req.sessionID },
//               type: Sequelize.QueryTypes.UPDATE,
//           });
//           res.send({
//               loggedIn: true,
//               user: req.session.user,
//               sessionID: req.sessionID,
//           });
//       } else {
//           res.send("not allowed");
//       }
//   } catch (error) {
//       console.log(error);
//   }
// });
// router.post("/login", async (req, res, next) => {
// 	const { email, password } = req.body;
// 	const user = await User.findOne({
// 		where: {
// 			email: email,
// 		},
// 	});

// 	if (!user) {
// 		return res.status(400).send("Cannot find user");
// 	}
// 	try {
// 		if (await bcrypt.compare(password, user.password)) {
// 			req.session.user = user;
//             req.session.save();
//             //add session id to database
//             let query = "update users set session_id=:session where id =:userid";
//             const users = await db.query(query, {
//                 replacements: {userid: user.dataValues.id, session: req.sessionID},
//                 type: Sequelize.QueryTypes.UPDATE
//             });
// 			res.send({ loggedIn: true, user: req.session.user });
// 		} else {
// 			res.send("not allowed");
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// });
router.post("/logout", async(req, res, next) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({
            where: {
                email: email
            }
        })
          if(!user){
            res.send("access denied");
          }else{
            let query = "update users set session_id=null where email=:email";
            const op = await db.query(query, {
                replacements: {email: email},
                type: Sequelize.QueryTypes.UPDATE
            })
            res.send("you logged out successfuly");
          }
        }catch(error) {
          console.log(error);
        }
      });
          

//a route to log the user in
// router.post('/login', async (req, res, next) => {     
//         const {email, password} = req.body;
//         const user = await User.findOne({ where: {
//             email: email,
//         }}) 
//         if(!user){
//             return res.status(400).send('Cannot find user');
//         }
//     try{
//         if(await bcrypt.compare(password, user.password)){
//             res.send('you logged in successfuly');
//         }else{
//             res.send("not allowed");
//         }
//     } catch (error) {
//         console.log(error);
//     }
// })

//A route to fetch a user's session id  by user email
router.get('/session/:email', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where:
        { email: req.params.email }
    });
    //const {email, session_id} = user;
    const result = user.session_id;
    //const result =user.email;
    //checking if session object return is empty or not
    if (result !== undefined && result !== null && result !== "") {
      res.status(200).json({ message: "User's session id: ", result });
    } else {
      //need another status code, not the right code 
      res.status(403).send('user does not have session id')
    }
  } catch (error) {
    next(error);
  }
});

//A route to fetch a single user's session id  by user id
router.get('/sessionid/:id', async (req, res, next) => {
  // if the user is not logged in , send a forbidden mesaage

    try {
      const user = await User.findByPk(req.params.id);
      //const {id, session_id} = user;
      const result = user.session_id;
      //checking if session object return is empty or not
      if (result !== undefined && result !== null && result !== "") {
        res.status(200).json({ message: "User's id is: ", result });
      } else {
        res.send('user does not have session id')
      }
    } catch (error) {
      next(error);
    }

});

//A route to fetch a single user by user email
router.get('/useremail/:email', async (req, res, next) => {

  // if the user is not logged in , send a forbidden mesaage
  if (!user) {
    res.status(403).send("User is not currently logged in.")
  } else {
    try {
      const user = await User.findOne({
        where:
          { email: req.params.email }
      });
      !user
        ? res.status(404).send('User Not Found')
        : res.status(200).json({ message: "User is found ", email });
    } catch (error) {
      next(error);
    }
  }
});


//A route to fetch a single user by id
router.get('/userid/:id', async (req, res, next) => {
  // if the user is not logged in , send a forbidden mesaage
  if (!user) {
    res.status(403).send("User is not currently logged in.")
  } else {
    try {
      const user = await User.findByPk(req.params.id);
      !user
        ? res.status(404).send('User Not Found')
        : res.status(200).json({ message: "User is found ", user });
    } catch (error) {
      next(error);
    }
  }
});

//A route to fetch all recipes of a user by user email
router.get('/userallrecipes/:email', async (req, res, next) => {
  // if the user is not logged in , send a forbidden mesaage
  if (!user) {
    res.status(403).send("User is not currently logged in.")
  } else {
    try {
      const user = await User.findOne({
        where:
          { email: req.params.email },
        include: [{
          model: Recipe
        }]
      })
      !user
        ? res.status(404).send('User Not Found')
        : res.status(200).json({ message: "User is found ", user });
    } catch (error) {
      next(error);
    }
  }
});

//A route to fetch all recipes associated with a user by user id
router.get('/useridallrecipes/:id', async (req, res, next) => {
  // if the user is not logged in , send a forbidden mesaage
  if (!user) {
    res.status(403).send("User is not currently logged in.")
  } else {
    try {
      const user = await User.findByPk(req.params.id,
        { include: Recipe })
      //{include: [{ model: Recipe}]})
      !user
        ? res.status(404).send('User Not Found')
        : res.status(200).json({ message: "User is found ", user });
    } catch (error) {
      next(error);
    }
  }
});

//a route to update a user by email
router.put('/updateuser/:email', async (req, res, next) => {
  // if the user is not logged in , send a forbidden mesaage
  if (!user) {
    res.status(403).send("User is not currently logged in.")
  } else {
    try {
      const updatedUser = await User.findOne({
        where:
          { email: req.params.email }
      });
      !updatedUser
        ? res.status(404).send('No such user exists')
        : (await updatedUser.update(req.body, { return: true }),
          res.status(200).json({ message: "User info is updated. ", updatedUser }));
    } catch (error) {
      next(error);
    }
  }
});

//a route to update a user by id
router.put('/updatebyid/:id', async (req, res, next) => {
  // if the user is not logged in , send a forbidden mesaage
  if (!user) {
    res.status(403).send("User is not currently logged in.")
  } else {
    try {
      const updatedUser = await User.findByPk(req.params.id, { return: true });
      !updatedUser
        ? res.status(404).send('No such user exists')
        : (await updatedUser.update(req.body, { return: true }),
          res.status(200).json({ message: "User info is updated. ", updatedUser }));
    } catch (error) {
      next(error);
    }
  }
});


// A route to delete a user by email
router.delete('/delete/:email', async (req, res, next) => {
  // if the user is not logged in , send a forbidden mesaage
  if (!user) {
    res.status(403).send("User is not currently logged in.")
  } else {
    try {
      const deletedUser = await User.findOne(
        {
          where:
            { email: req.params.email }
        });
      !deletedUser
        ? res.status(404).send('No such user exists')
        : (await deletedUser.destroy(),
          res.status(200).json({ message: "User is deleted" }));
    } catch (error) {
      next(error);
    }
  }
});

// A route to delete a user by id
router.delete('/deletebyid/:id', async (req, res, next) => {
  // if the user is not logged in , send a forbidden mesaage
  if (!user) {
    res.status(403).send("User is not currently logged in.")
  } else {
    try {
      const deletedUser = await User.findByPk(req.params.id);
      !deletedUser
        ? res.status(404).send('No such user exists')
        : (await deletedUser.destroy(),
          res.status(200).json({ message: "User is deleted" }));
    } catch (error) {
      next(error);
    }
  }
});


module.exports = router;
