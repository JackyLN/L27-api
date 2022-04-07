const express = require('express')
const router = express.Router()
const fs = require('fs')
const { validate, ValidationError, Joi } = require('express-validation')
const Product = require('../models/Product');

const ProductDAO = require('../data_access/ProductDAO');
// router.use((req, res, next) => {
//   const productDAO = new ProductDAO(req.app.mongoConnection);
//   req.productDAO = productDAO;
//   next()
// })

//RESET & pre import db
router.post('/reset', async (req, res) => {
  try {
    const productDAO = new ProductDAO(req.app.mongoConnection);
    const dummyData = await productDAO.resetDummyProducts();

    res.status(200).json(dummyData);
  } catch (ex) {
    //TODO Handle error
    console.log(ex);
  }
});

router.get('/all', async (req, res) => {
  const productDAO = new ProductDAO(req.app.mongoConnection);
  let data = await productDAO.getAllProducts();
  res.status(200).json(data);
});

router.get('/', async (req, res) => {

  try {
    const productDAO = new ProductDAO(req.app.mongoConnection);
    const params = { name: req.query.name };
    const option = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 5
    };

    let data = await productDAO.getProducts(params, option);
    res.status(200).json(data);
  } catch (ex) {
    //TODO Handle error
    console.log(ex);
  }
});

router.post('/', async (req, res) => {
  try {
    const productDAO = new ProductDAO(req.app.mongoConnection);
    const productData = {
      name: req.body.name,
      material: req.body.material,
      size: req.body.size,
      color: req.body.color,
      description: req.body.description,
      availability: req.body.availability,
      price: req.body.price,
      image: req.body.image
    }
    const product = await productDAO.createProduct(productData);
    res.status(200).json(product);
  } catch (ex) {
    console.log(ex);
  }
});

router.patch('/:product_id', async (req, res) => {
  try {
    const productDAO = new ProductDAO(req.app.mongoConnection);

    const { product_id: productID } = req.params;
    const productData = {
      ...req.body
    };
    const updatedProduct = await productDAO.updateProduct(productID, productData);
    res.status(200).json(updatedProduct);
  } catch (ex) {
    console.log(ex);
  }
});

router.delete('/:product_id', async (req, res) => {
  try {

    const { product_id: productID } = req.params;

    const productDAO = new ProductDAO(req.app.mongoConnection);
    const isDeleted = await productDAO.deleteProduct(productID);
    res.status(200).json(isDeleted);
  } catch (ex) {
    console.log(ex);
  }
})


module.exports = router;