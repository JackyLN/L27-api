const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');

const imageServer = config.server.IMAGE_SERVER;
const defaultCurrency =  config.product.DEFAULT_CURRENCY;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  material: { type: String, required: true },
  size: { type: [String] },
  color: { type: [String] },
  description: { type: String },
  availability: { type: [String] },
  price: { type: [Schema.Types.Mixed], required: true },
  image: { type: [String] }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  },
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();

      delete ret._id;
      delete ret.__v;

      ret.image = ret.image.map(i => new URL(i, imageServer).toString());
    }
  }
});
ProductSchema.price = {
  amount: { type: Number, required: true },
  currency: { type: String, default: defaultCurrency, required: true }
}

module.exports = ProductSchema;