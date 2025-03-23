const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: {type: String},
    holder: String,
    type: String,
    detail: {
        expiryDate: String,
        cvv: String
    }
});

const Payment = mongoose.model("payment", PaymentSchema);

module.exports = Payment;