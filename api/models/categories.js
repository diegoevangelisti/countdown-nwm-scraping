const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: String,
    category_name: String,
    url: String,
    last_update: String
});

module.exports = mongoose.model('Category', categorySchema);