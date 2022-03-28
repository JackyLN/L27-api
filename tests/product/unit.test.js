const { expect } = require("chai");
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');

const ProductDAO = require("../../src/data_access/ProductDAO");

describe('Product DAO unit test', () => {

  //1647963839726

  let mongoServer;
  let productDAO, dummyData, params, options;
  const opts = {
    useUnifiedTopology: true
  }

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    productDAO = new ProductDAO(mongoose);
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

        dummyData = await productDAO.resetDummyProducts();

        expect(dummyData).to.be.an('array');
        expect(dummyData.length).to.be.equal(data.length);
      } catch (err) {
        expect(err).to.equal(null);
      }
    });
  });

  describe('getAllProducts', () => {
    it('should get all product in database', async () => {
      const result = await productDAO.getAllProducts();

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
      const result = await productDAO.getProducts(params, options);
      
      expect(parseInt(result.count)).to.be.equal(dummyData.length);
    });
  });
});