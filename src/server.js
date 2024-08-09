const express = require('express');
const app = express();
const ClientError = require('./exceptions/ClientError');
const cookieParser = require('cookie-parser');

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

// Routing API using base path variable
app.use(userRoutes);
app.use(authenticationRoutes);

app.use((err, req, res, next) => {
  if (err instanceof Error) {
    // Handle client errors that are classified explicitly
    if (err instanceof ClientError) {
      console.error(err); // Optional: log the error
      return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message
      });
    }

    // Default handling for other client errors (e.g., malformed requests, validation errors)
    if (!err.isServer) {
      return res.status(err.statusCode || 400).json({
        status: 'fail',
        message: err.message || 'Bad request'
      });
    }

    // Server errors
    console.error(err); // Log the server error
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }

  // If no errors are found, pass control to the next middleware
  next();
});
