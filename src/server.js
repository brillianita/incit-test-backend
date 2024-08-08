const express = require('express');

const app = express();

const userRoutes = require('./api/users/routes');

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

// ROuting API using base path variable
app.use(userRoutes);