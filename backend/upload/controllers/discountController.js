const Discount = require('../models/Discount');
const AppError = require('../helpers/appError');

exports.addDiscount = async (req, res, next) => {
    try {
        let discount = new Discount({
            code: req.body.code,
            scope: req.body.scope,
            type: req.body.type,
            value: req.body.value,
            createdAt: new Date(Date.now()),
            expired: new Date(Date.now() + req.body.day * 24 * 60 * 60 * 1000)
        })
    
        const response = await discount.save();
        if(!response) throw new AppError ("Can not save discount.", 500);
    
        res.json({
            success: true,
            data: discount
        })
    } catch (error) {
        next(error);
    }
}

exports.getAllDiscount = async (req, res, next) => {
    try {
        let discounts = await Discount.find();
        if(discounts.length === 0 || !discounts) throw AppError ("No discount available.", 404);
        res.json({
            success: true,
            data: discounts
        });
    } catch (error) {
        next(error);
    }
}

exports.getDiscountByCode = async (req, res, next) => {
    try {
        let discount = await Discount.findOne({code: req.params.code});
        
        if(!discount) throw new AppError ("Discount not found.", 404);
        res.json({
            success: true,
            data: discount
        })
    } catch (error) {
        next(error);
    }
}

exports.deleteDiscount = async (req, res, next) => {
    try {
        let discount = await Discount.findByIdAndDelete(req.body.discountId);

        if(!discount) throw new AppError ("Can not delete discount.", 500);

        res.json({
            success: true
        })
    } catch (error) {
        next(error);
    }
}