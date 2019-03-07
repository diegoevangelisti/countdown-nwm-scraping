const mongoose = require('mongoose');


const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.Number,
    category_name: String,
    url: String
});


const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    category_id: String,
    product_name: String,
    product_price: {
        normal_price: Number,
        offer_price: Number
    },
    measure_unit: String,
    url: String
})

module.exports = mongoose.model('Product', productSchema);
module.exports = mongoose.model('Category', categorySchema);

