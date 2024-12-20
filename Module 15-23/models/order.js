const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Order = Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    email: {
        type: String,
        required: true,
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
  }
});

module.exports = mongoose.model("Order", Order);
