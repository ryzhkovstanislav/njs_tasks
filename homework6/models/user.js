const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    isSuperuser: {type: Boolean, default: false},
});

const User = mongoose.model('User', userSchema);
module.exports = User;
