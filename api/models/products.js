const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: String,
    category_id: String,
    shop_id: String,
    product_name: String,
    product_price: {
        normal_price: String,
        offer_price: String
    },
    measure_unit: String,
    image_url: String,
    url: String,
    last_update: String
})

module.exports = mongoose.model('Product', productSchema);