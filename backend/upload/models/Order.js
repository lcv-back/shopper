const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: String,
    items: Object,
    totalPrice: String,
    paymentMethod: String,
    cardInfo: {type: Object, default: undefined},
    status: {type: String, default: "pending"},
    shipAddress: {type: Object, default: undefined},
    createAt: {type: Date, default: Date.now}
});

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;