const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: Number,
    category_name: String,
    url: String
});

module.exports = mongoose.model('Category', categorySchema);