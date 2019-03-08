const mongoose = require('mongoose');

// Crete mongoose schema
const userSchema = mongoose.Schema({
    _id: String,
    user_name: String,
    age: Number,
    gender: String,
    nationality: String,
    email: String,
    contact_number: Number
})

module.exports = mongoose.model('User', userSchema);