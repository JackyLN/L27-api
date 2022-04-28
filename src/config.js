const dotenv = require('dotenv');
dotenv.config();

const config = {
  server: {
    APPLICATION_PORT: process.env.PORT || 3000,
    APPLICATION_MONGOOSE: process.env.APPLICATION_MONGOOSE,
    IMAGE_SERVER: process.env.IMAGE_SERVER,
    AUTH_PRIVATE_KEY: process.env.AUTH_PRIVATE_KEY,
    AUTH_PUBLIC_KEY: process.env.AUTH_PUBLIC_KEY
  },
  product: {
    DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY
  },
}

module.exports = config;