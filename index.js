//NODE MODULES
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const path = require('path');

//IMPORTS/VARIABLES
const PORT = process.env.PORT || 8080;
const db = require('./db');
const app = express();

//UTILITIES 
const seedDatabase = require('./seed.js');

//CORS!
app.use(cors());

//Mount on API
app.use('/api', require('./api'));

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
  .then(() => console.log("database is connected"))
  .catch(error => console.log(error));
  
const syncDb = () => {
  
  if (process.env.NODE_ENV === 'production') {
    db.sync();
  }
  else {
    console.log('As a reminder, the forced synchronization option is on');
    db.sync({ force: true })
      .then(() => seedDatabase())
      .catch(err => {
        if (err.name === 'SequelizeConnectionError') {
          createLocalDatabase();
          seedDatabase();
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
