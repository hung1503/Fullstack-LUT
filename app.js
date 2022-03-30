const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const config = require('./config/database');


//Connect to database
mongoose.connect(config.database);

// On connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
})

// On error
mongoose.connection.on('error', (err) => {
  console.log('Database Error ' + err);
})

const app = express();

const users = require('./routes/users');
const { allowedNodeEnvironmentFlags } = require('process');
// Cors middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

app.use(session({ secret: config.secret }))
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
// Index route
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

// Port Number
const port = process.env.PORT || 8080;

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})