const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
    code: {type: String, unique: true},
    scope: String,
    type: String,
    value: String,
    createdAt: Date,
    expired: Date
});

const Discount = mongoose.model("discount", DiscountSchema);

module.exports = Discount;