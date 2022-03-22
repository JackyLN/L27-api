
const ProductSchema = require('../models/Product');

class ProductDAO {
  constructor(mongoConnection) {
    console.log(mongoConnection);
    this.models = {
      Product: mongoConnection.model('Product', ProductSchema) 
    };
  }

  async getAllProduct() {
    try {
      const products = await this.models.Product.find({});
      if (products) return products.map(product => product.toJSON());
      else return [];
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductDAO;