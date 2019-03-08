const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: String,
    category_id: Number,
    product_name: String, 
    product_price: {
        normal_price: String,
        offer_price: String
    },
    measure_unit: String,
    url: String
})

module.exports = mongoose.model('Product', productSchema);