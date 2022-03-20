const dotenv = require('dotenv');
dotenv.config();

const config = {
  server: {
    APPLICATION_PORT: process.env.PORT || 3000,
    APPLICATION_MONGOOSE: process.env.APPLICATION_MONGOOSE
  }
}

module.exports = config;