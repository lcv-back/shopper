const Payment = require('../models/Payment');
const AppError = require('../helpers/appError');

exports.addPayment = async (req, res, next) => {
    try {
        const newPayment = new Payment({
            userId: req.user.id,
            holder: req.body.holder,
            type: req.body.type,
            detail: req.body.detail
        });
    
        const createPayment = await newPayment.save();
        if(!createPayment) throw new AppError ("Can not create payment.", 500);
        res.json({
            status: 200,
            data: newPayment
        });
    } catch (error) {
        next(error);
    }
}

exports.getAllPayment = async (req, res, next) => {
    try{
        const payments = await Payment.findOne({userId: req.user.id});
        if(payments.length == 0) {
            throw new AppError ("No payment available.", 404);
        } else {
            res.json({
                status: 200,
                data: payments
            });
        }
    } catch (err) {
        next(err);
    }
}

exports.updatePayment = async (req, res, next) => {
    try {
        const payment = await Payment.findOneAndUpdate(
            {_id: req.params.paymentId}, 
            {$set: req.body}, 
            {new: true, upsert: false});
        if(!payment){
            throw new AppError ("Can not update payment.", 500);
        } else {
            res.json({
                status: 200,
                data: payment
            })
        }
    } catch (error) {
        next(error);
    }
}

exports.deletePayment = async (req, res, next) => {
    try {
        const payment = await Payment.findOneAndDelete(
            {_id: req.params.paymentId, userId: req.user.id});
            
        if(!payment){
            throw new AppError ("Can not delete payment.", 500);
        } else {
            res.json({
                status: 200,
                data: payment
            })
        }
    } catch (error) {
        next(error);
    }
}