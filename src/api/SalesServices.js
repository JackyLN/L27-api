const express = require('express')
const router = express.Router()
const fs = require('fs')
const { validate, ValidationError, Joi } = require('express-validation')

const saleValidation = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
}

let filename = 'data/privatesale.json';
//GET
router.get('/', async (req, res) => {

  if (fs.existsSync(filename)) {
    let data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    res.status(200).json(data);
  }
  else {
    fs.writeFileSync(filename, "[{}]");
    res.status(200).json({
      count: 0,
      data: [{}]
    })
  }
});

router.post('/', async (req, res) => {
  try {
    // let input = {
    //   title: "Mrs",
    //   first: "Les",
    //   last: "Nghias",
    //   email: "lenghsia1991@gmail.com",
    //   birthday: "06a/11/1991",
    //   interestedin: "menwear",
    //   shoppingsection: "business",
    //   contactpreference: ["newsletter"]
    // }
    let { body } = req;
    let input = {
      title: body.title,
      first: body.first,
      last: body.last,
      email: body.email,
      birthday: body.birthday,
      interestedin: body.interestedin,
      shoppingsection: body.shoppingsection,
      contactpreference: body.contactpreference,
      contact_upcoming_event: body.contact_upcoming_event,
      contact_exclusive_deals: body.contact_exclusive_deals,
      contact_newsletter: body.contact_newsletter
    }
    console.log(body);
    let existedContent = fs.readFileSync(filename, 'utf8');
    let obj = JSON.parse(existedContent);
    obj.push(input);
    let json = JSON.stringify(obj); //convert it back to json
    fs.writeFileSync(filename, json, 'utf8');

    //var user_name = req.body.user;
    //var password = req.body.password;

    res.status(200).json({
      status: "Success"
    });
  } catch (ex) {
    console.log(ex);
    res.status(200).json({
      status: "Error",
      message: ex.message
    });
  }
});


module.exports = router;