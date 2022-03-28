const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');

const ProductSchema = new Schema({
  name: { type: String, required: true },
  material: { type: String, required: true },
  size: { type: [String] },
  color: { type: [String] },
  description: { type: [String] },
  availability: { type: [String] },
  price: { type: Schema.Types.Mixed, required: true },
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

      ret.image = ret.image.map(i => new URL(i, config.server.IMAGE_SERVER));
    }
  }
});
ProductSchema.price = {
  amount: { type: Number, required: true },
  currency: { type: String, default: config.product.DEFAULT_CURRENCY }
}

module.exports = ProductSchema;