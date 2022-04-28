
const fs = require('fs')
const assert = require('assert-plus');
const ProductSchema = require('../models/Product');

const filename = 'data/l27sale.json';

class ProductService {
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
        query = query.where({ name: { $regex: params.name, $options: 'i' } });
        count_query = count_query.where({ name: { $regex: params.name, $options: 'i' } });
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

  async createProduct(productData) {
    try {
      assert.string(productData.name);
      assert.string(productData.material);
      assert.optionalArrayOfString(productData.size);
      assert.optionalArrayOfString(productData.color);
      assert.optionalString(productData.description);
      assert.optionalString(productData.availability);
      assert.arrayOfObject(productData.price);
      assert.optionalArrayOfString(productData.image);

      const createUser = await this.models.Product.create(productData);

      return createUser.toJSON();
    } catch (ex) {
      console.log(ex);
    }
  }

  async updateProduct(productId, productData) {
    try {
      assert.string(productId);
      assert.object(productData);
      assert.optionalString(productData.name);
      assert.optionalString(productData.material);
      assert.optionalArrayOfString(productData.size);
      assert.optionalArrayOfString(productData.color);
      assert.optionalString(productData.description);
      assert.optionalArrayOfString(productData.availability);
      assert.optionalArrayOfObject(productData.price);
      assert.optionalArrayOfString(productData.image);

      const updatedUser = await this.models.Product.findByIdAndUpdate(productId, productData, { new: true });
      if (!updatedUser) {
        throw new Error('Product Not Found');
      }

      return updatedUser.toJSON();

    } catch (ex) {
      console.log(ex);
    }
  }

  async deleteProduct(productId) {
    assert.string(productId);
    const isDeleted = await this.models.Product.findByIdAndDelete(productId);

    return isDeleted ? true : false; //TODO
  }
}

module.exports = ProductService;