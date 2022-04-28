const express = require('express')
const router = express.Router()
const fs = require('fs')
const { validate, ValidationError, Joi } = require('express-validation')

const UserService = require('../services/UserService');

//router.post('/', )


router.get('/create-user-default', async (req, res) => {
  let defaultUser = {
    full_name: "My Admin",
    email: "admin@lazychord.com",
    password: "Password@123"
  };
  try {
    const userService = new UserService(req.app.mongoConnection);
    const user = userService.createDefaultUser(defaultUser);

    res.status(200).json(user);
  } catch (ex) {
    //TODO Handle error
    console.log(ex);
  }

})

router.post('/', async (req, res) => {
  
});


module.exports = router;