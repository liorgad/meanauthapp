const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

var uri = config.database;
mongoose.Promise = require('bluebird');
/*var db = mongoose.createConnection(uri,options);
db.then(
    ()=> {console.log('Connected to database ' + config.database);},
    (error) => {console.log('Error connecting to database '+ error);}
);*/

mongoose.connect(config.database,{ useNewUrlParser: true }).then(
    ()=> {console.log('Connected to database ' + config.database);},
    (error) => {console.log('Error connecting to database '+ error);}
);

const app = express();

const users = require('./routes/users');

// Port number
const port = 3001;

// CORS Middleware
app.use(cors());

// Set static Folder
app.use(express.static(path.join(__dirname,'public')));

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

// Body parser Middleware
app.use(bodyParser.json());

app.use('/users',users);

// Index route
app.get('/', (req,res) => {
    res.send('Invalid endpoint');
});

// Start server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});


