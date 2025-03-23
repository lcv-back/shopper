const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    cartData: {
        type: Object
    },
    selectAddress: {
        type: Object,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;