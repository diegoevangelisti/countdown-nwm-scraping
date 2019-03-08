const mongoose = require('mongoose');

// Crete mongoose schema
const shopSchema = mongoose.Schema({
    _id: String,
    shop_name: String
});

module.exports = mongoose.model('Shop', shopSchema);