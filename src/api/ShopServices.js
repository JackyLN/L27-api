const express = require('express')
const router = express.Router()
const fs = require('fs')
const { validate, ValidationError, Joi } = require('express-validation')

let filename = 'data/l27sale.json';

router.get('/', async (req, res) => {

  if (fs.existsSync(filename)) {

    // const pageOptions = {
    //   page: parseInt(req.query.page, 10) || 0,
    //   limit: parseInt(req.query.limit, 10) || 4
    // }
    
    const {
      name
    } = req.query;

    let data = JSON.parse(fs.readFileSync(filename, 'utf8'));

    if (name) {
      let re = new RegExp(name, 'g')
      const search = data.filter(element => element.Name.match(re));
      res.status(200).json(search);
    } else {
      res.status(200).json(data);
    }
  }
  else {
    fs.writeFileSync(filename, "[{}]");
    res.status(200).json({
      count: 0,
      data: [{}]
    })
  }
});


module.exports = router;