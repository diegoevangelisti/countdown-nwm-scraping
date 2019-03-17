const mongoose = require('mongoose');

// Crete mongoose schema
const branchSchema = mongoose.Schema({
    _id: String,
    shop_id: String,
    branch_name: String,
    address: String,
    lat: String, 
    long: String
});

module.exports = mongoose.model('Branch', branchSchema);