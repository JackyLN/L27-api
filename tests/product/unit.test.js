const { expect } = require("chai");
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');

const config = require('../../src/config');

const ProductService = require("../../src/services/ProductService");

describe('Product Service unit test', () => {

  //1647963839726

  let mongoServer;
  let productService, dummyData, params, options;
  const opts = {
    useUnifiedTopology: true
  }

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    productService = new ProductService(mongoose);
    // mongoServer.create()
    //   .getConnectionString()
    //   .then(mongoUri => {
    //     return mongoose.connect(mongoUri, opts, err => {
    //       if (err) done(err);
    //     });
    //   })
    //   .then(() => done());

  });
  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('resetDummyProducts', () => {
    it('should insert every data from the file', async () => {
      try {

        const filename = 'data/l27sale.json';
        //dump data inside
        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));

        dummyData = await productService.resetDummyProducts();

        expect(dummyData).to.be.an('array');
        expect(dummyData.length).to.be.equal(data.length);
      } catch (err) {
        expect(err).to.equal(null);
      }
    });
  });

  describe('getAllProducts', () => {
    it('should get all product in database', async () => {
      const result = await productService.getAllProducts();

      expect(result.length).to.be.equal(dummyData.length);
    });
  });

  describe('getProducts', () => {
    beforeEach(() => {
      params = {};
      options = {
        page: 0,
        limit: 5
      };
    });

    it('should get all product in database without params', async () => {
      const result = await productService.getProducts(params, options);

      expect(parseInt(result.count)).to.be.equal(dummyData.length);
      expect(result.data.length).to.be.greaterThan(1);
    });

    it('should return pagination', async () => {
      let totalLength = dummyData.length;
      let totalPage2Items = totalLength / 2;
      if (totalLength / 2 != 0) totalPage2Items++;

      options.limit = 2;
      let count = 0;
      let checkContinue = true;

      while (checkContinue) {
        const result = await productService.getProducts(params, options);
        options.page++;

        if (result.data.length != 0) {
          count = count + result.data.length;
        } else {
          checkContinue = false;
        }
      }
      expect(count).to.be.equal(dummyData.length);
    });

    it('should search by name', async () => {
      params.name = "poplin";
      const result = await productService.getProducts(params, options);

      expect(result.count).to.be.greaterThan(0);
      expect(result.data.length).to.be.greaterThan(0);
      expect(dummyData.length).to.be.greaterThan(result.count);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      try {
        const data = {
          name: "Test new Product",
          material: "Silk",
          size: ["L", "M"],
          color: ["black", "red"],
          description: "Test description",
          availability: "Available",
          price: [{ amount: 1000, currency: config.product.DEFAULT_CURRENCY }],
          image: ["test_img.png"]
        }

        const result = await productService.createProduct(data);

        const params = { "name": "Test new Product" };
        const options = {
          page: 0,
          limit: 5
        };
        const searchNew = await productService.getProducts(params, options);

        expect(result).to.be.an('object');
        expect(result).to.have.property('name');
        expect(result).to.have.property('material');
        expect(result).to.have.property('size');
        expect(result).to.have.property('color');
        expect(result).to.have.property('price');
        expect(result.price[0]).to.have.property('currency');
        expect(result.price[0].amount).to.be.equal(1000);

        expect(searchNew.count).to.be.equal(1);
      }
      catch (ex) {
        expect(ex).to.equal(null);
      }
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const dataUpdate = {
        description: "New description",
        color: ["white"]
      }

      const searchProduct = await productService.getProducts({ "name": "Test new Product" }, { page: 0, limit: 1 });
      const updateProductId = searchProduct.data[0].id;

      const updatedProduct = await productService.updateProduct(updateProductId, dataUpdate);

      const newSearchProduct = await productService.getProducts({ "name": "Test new Product" }, { page: 0, limit: 1 });

      expect(updatedProduct).to.be.an('object');
      expect(updatedProduct.id).to.be.equal(newSearchProduct.data[0].id);
      expect(updatedProduct.name).to.be.equal(newSearchProduct.data[0].name);
      expect(newSearchProduct.data[0].description).to.be.equal(dataUpdate.description);
      expect(newSearchProduct.data[0].color[0]).to.be.equal(dataUpdate.color[0]);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {

      const searchProduct = await productService.getProducts({ "name": "Test new Product" }, { page: 0, limit: 1 });
      const productId = searchProduct.data[0].id;

      const isDeleted = await productService.deleteProduct(productId);
      
      const secondDelete = await productService.deleteProduct(productId);

      expect(isDeleted).to.be.equal(true);
      expect(secondDelete).to.be.equal(false);
    })
  })
});