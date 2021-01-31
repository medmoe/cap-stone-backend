//NODE MODULES
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
//const axios =require('axios');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const models = require('./db/models');
const session = require('express-session');


require('dotenv').config();


//IMPORTS/VARIABLES
const PORT = process.env.PORT || 8080;
const db = require('./db');
const app = express();

//UTILITIES 
const seedDatabase = require('./seed.js');

//CORS!
const corsOptions = {
	origin: "http://recipe-board-app.netlify.com",
	credentials: true,
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(
	session({
		key: "id",
		secret: "subscribe",
		resave: false,
		saveUninitialized: false,
	})
);


//BODY PARSER
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));

//Mount on API
app.use('/api', require('./api'));



// Error handling;
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  }
  else {
    next();
  }
});

//START BACKEND SERVER FUNCTIOON
const serverRun = () => {
  const server = app.listen(PORT, () => {
    console.log(`Live on port : ${PORT}`);
  });
};
//DB Sync Function
//Optional parameters
// {force:true} - drops current tables and places new empty tables
//{alter:true} - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.

//check if the database is connected
db.authenticate()
  .then(() => {
    console.log("database is connected");
    // fetch recipes by first letter and store them in database
  })
  .catch(error => console.log(error));
  
const syncDb = () => {
  
  if (process.env.NODE_ENV === 'production') {
    db.sync();
	  seedDatabase();
  }
  else {
    console.log('As a reminder, the forced synchronization option is on');
    db.sync({ force: true })
      .then(() => seedDatabase())
      .catch(err => {
        if (err.name === 'SequelizeConnectionError') {
          console.log(err.name);
        }
        else {
          console.log(err);
        }
      });
    }
};
//Run server and sync DB
syncDb();
serverRun();

module.exports = app;
