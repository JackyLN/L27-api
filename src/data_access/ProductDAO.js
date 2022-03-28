
const fs = require('fs')
const assert = require('assert-plus');
const ProductSchema = require('../models/Product');

const filename = 'data/l27sale.json';

class ProductDAO {
  constructor(mongoConnection) {
    this.models = {
      Product: mongoConnection.model('Product', ProductSchema) 
    };
  }

  async resetDummyProducts() {
    await this.models.Product.deleteMany();

    //dump data inside
    let data = JSON.parse(fs.readFileSync(filename, 'utf8'));

    let result = await this.models.Product.insertMany(data);

    return result.map(r => r.toJSON());
  }

  async getAllProducts() {
    try {
      const products = await this.models.Product.find({});
      if (products) return products.map(product => product.toJSON());
      else return [];
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts(params, option) {
    assert.optionalString(params.name);
    assert.number(option.page);
    assert.number(option.limit);

    try {
  
      let query = this.models.Product.find({});
      let count_query = this.models.Product.count();
      let products = [], total = 0;
  
      if (params.name) {
        query = query.where({name: {$regex: params.name, $options: 'i'}});
        count_query = count_query.where({name: {$regex: params.name, $options: 'i'}});
      }

      query = query.skip(option.page * option.limit)
        .limit(option.limit);
      
      // if (id) {
      //   query = query.where('id').equals(id);
      //   count_query = count_query.where('id').equals(id);
      // }
  
      total = await count_query.exec();
      products = await query.exec();
  
      return {
        count: total,
        data: products ? products.map(product => product.toJSON()) : []
      };
    } catch (ex) {
      console.log(ex);
    }
  }
}

module.exports = ProductDAO;