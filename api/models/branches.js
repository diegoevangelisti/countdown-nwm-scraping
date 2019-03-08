const mongoose = require('mongoose');

// Crete mongoose schema
const branchSchema = mongoose.Schema({
    _id: String,
    shop_id: Number,
    branch_name: String,
    address: String,
    latitude: String,
    longitude: String
});

module.exports = mongoose.model('Branch', branchSchema);