const Order = require('../models/Order');
const User = require('../models/User');
const {totalPrice, filterdCartItems} = require('../middlewares/checkoutMiddleware');
const AppError = require('../helpers/appError');

exports.checkout = async (req, res, next) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });
        if(!userData) throw new AppError ("User not found.", 404);
        let newOrder = new Order({
            userId: req.user.id,
            items: filterdCartItems(userData.cartData),
            totalPrice: req.body.totalPrice,
            paymentMethod: req.body.paymentMethod,
            cardInfo: req.body.paymentMethod == "card" ? {
                cardName: req.body.cardInfo.cardName,
                cardType: req.body.cardInfo.cardType,
                cardExpired: req.body.cardInfo.cardExpired
            } : undefined,
            shipAddress: {
                street: req.body.shipAddress.street,
                city: req.body.shipAddress.city,
                country: req.body.shipAddress.country
            }
        })
    
        let cart = userData.cartData;
        Object.keys(cart).forEach(key => {
            cart[key] = 0;
        });
        const updateUser = await User.findOneAndUpdate({ _id: req.user.id }, { cartData: cart }, {new: true});
        if(!updateUser) throw new AppError ("Can not update cart.", 500);
        
        const createOrder = await newOrder.save();
        if(!createOrder) throw new AppError ("Can not create order.", 500);

        res.json({
            success: true,
            data: newOrder
        })
    } catch (error) {
        next(error);
    }
}

exports.getAllOrder = async (req, res, next) => {
    try {
        let orders = await Order.find({});
        if(orders.length === 0 || !orders) throw new AppError ("No order is available.", 404);
        res.json(orders);
    } catch (error) {
        next(error);
    }
}

exports.updateOrder = async (req, res, next) => {
    try {
        const order= await Order.findByIdAndUpdate(req.params.orderId, {$set: req.body}, {new: true});
        if(!order) throw new AppError ("Can not update order.", 500);
        res.json(order);
    } catch (error) {
        next(error);
    }
}