const Address = require('../models/Address');
const AppError = require("../helpers/appError");

exports.addAddress = async (req, res, next) => {
    try {
        const {street, city, country} = req.body;
        if(!street || !city || !country) {
            throw new AppError ("Street, city, country is required.", 400);
        }

        const newAddress = new Address({
            userId: req.user.id,
            street: street,
            city: city,
            country: country
        });
    
        const response = await newAddress.save();
        if(!response) {
            throw new AppError("Cannot add address.", 500);
        }
        res.json({
            status: 200,
            data: newAddress
        });
    } catch (error) {
        next(error);
    }
}

exports.getAllAddress = async (req, res, next) => {
    try {
        const userId= req.user.id;
        const addresses = await Address.find({userId: userId});

        if(addresses.length == 0){
            throw new AppError("No address available.", 404)
        } else {
            res.json({
                status: 200,
                data: addresses
            })
        }
    } catch (error) {
        next(error);
    }
}

exports.updateAddress = async (req, res, next) => {
    try {
        const address = await Address.findOneAndUpdate(
            {_id: req.params.addressId, userId: req.user.id}, 
            {$set: req.body}, 
            {new: true, upsert: false});
        if(!address){
            throw new AppError("No address available.", 404);
        } else {
            res.json({
                status: 200,
                data: address
            })
        }
    } catch (error) {
       next(error);
    }
}

exports.deleteAddress = async (req, res, next) => {
    try {
        const address = await Address.findOneAndDelete(
            {_id: req.params.addressId});

        if(!address){
            throw new AppError("No address available.", 404);
        } else {
            res.json({
                status: 200,
                data: address
            })
        }
    } catch (error) {
        next(error);
    }
}