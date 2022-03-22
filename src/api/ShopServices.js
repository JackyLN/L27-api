const express = require('express')
const router = express.Router()
const fs = require('fs')
const { validate, ValidationError, Joi } = require('express-validation')
const Product = require('../models/Product');
const filename = 'data/l27sale.json';

const ProductDAO = require('../data_access/ProductDAO');

// router.use((req, res, next) => {
//   const productDAO = new ProductDAO(req.app.mongoConnection);
//   req.productDAO = productDAO;
//   next()
// })

//RESET & pre import db
router.post('/reset', async (req, res) => {
  try {
    //db cleanup
    await Product.deleteMany();

    //dump data inside
    let data = JSON.parse(fs.readFileSync(filename, 'utf8'));

    let result = await Product.insertMany(data);

    res.status(200).json(result);
  } catch (ex) {
    //TODO Handle error
    console.log(ex);
  }
});

router.get('/', async (req, res) => {
  const productDAO = new ProductDAO(req.app.mongoConnection);
  let data = await productDAO.getAllProduct();
  res.status(200).json(data);
});

router.get('/test', async (req, res) => {

  try {

    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10
    }

    const {
      name
    } = req.query;

    let query = Product.find({});
    let count_query = Product.count();
    let result = [], total;

    if (name) {
      result = await Product.find({name: {$regex: name, $options: 'i'}});
    }

    result = await Product.find({});
    total = result.length;
    
    UserSchema.find({name: {$regex: name, $options: 'i'}}).limit(5);
    if (user_id) {
      query = query.where('user_id').equals(user_id);
      count_query = count_query.where('user_id').equals(user_id);
    }
    if (id) {
      query = query.where('id').equals(id);
      count_query = count_query.where('id').equals(id);
    }

    query = query.skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit);

    total = await count_query.exec();
    result = await query.exec();

    res.status(200).json({
      count: total,
      data: result
    });
  } catch (ex) {
    //TODO Handle error
    console.log(ex);
  }

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