const mongoose = require('mongoose');
var textSearch = require('mongoose-text-search')

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
    url: String,
    last_update: String
})

productSchema.plugin(textSearch);
//to implement text search
productSchema.index({"$**": 'text'});


module.exports = mongoose.model('Product', productSchema);