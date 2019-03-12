const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Crete mongoose schema
var userSchema = mongoose.Schema({
    _id: String,
    user_name: String,
    password: String,
    age: Number,
    gender: String,
    nationality: String,
    email: String,
    contact_number: Number
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);