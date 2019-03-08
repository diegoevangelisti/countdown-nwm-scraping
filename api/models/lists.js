const mongoose = require('mongoose');

// Crete mongoose schema
const listSchema = mongoose.Schema({
    _id: String,
    list_name: String,
    date_created: String,
    date_updated: String
})

module.exports = mongoose.model('Lists', listSchema);