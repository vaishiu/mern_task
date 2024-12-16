const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  dateOfSale: Date,
  title: String,
  description: String,
  price: Number,
  sold: Boolean,
  category: String,
});

module.exports = mongoose.model('Transaction', TransactionSchema);
