const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: String,
    category_id: String,
    product_name: String,
    product_price: {
        normal_price: Number,
        offer_price: Number
    },
    measure_unit: String,
    url: String,
    last_update: String
})


productSchema.index({
    product_name: 'text'
});


module.exports = mongoose.model('Product', productSchema);