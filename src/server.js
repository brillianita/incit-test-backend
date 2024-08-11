const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('./config/passportSetup')(passport);
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true
};

//use cors
app.use(cors(corsOptions));

app.use(cookieParser());

const userRoutes = require('./api/users/routes');
const authenticationRoutes = require('./api/authentications/routes');

const PORT = process.env.PORT || 3300;

// To access the environment variable
require('dotenv').config();

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});

// Configure session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routing API using base path variable
app.use(userRoutes);
app.use(authenticationRoutes);


