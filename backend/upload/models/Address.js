const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    userId: {type: String},
    street: String,
    city: String,
    country: String
});

const Address = mongoose.model('address', AddressSchema);

module.exports = Address;