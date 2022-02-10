const dotenv = require('dotenv');
dotenv.config();

const config = {
  server: {
    APPLICATION_PORT: process.env.PORT || 3000,
  }
}

module.exports = config;