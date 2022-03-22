const dotenv = require('dotenv');
dotenv.config();

const config = {
  server: {
    APPLICATION_PORT: process.env.PORT || 3000,
    APPLICATION_MONGOOSE: process.env.APPLICATION_MONGOOSE
  },
  product: {
    DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY
  },
}

module.exports = config;