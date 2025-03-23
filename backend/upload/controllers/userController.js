const jwt = require ('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../helpers/appError');

exports.registing = async (req, res, next) => {
    try {
        let check = await User.findOne({
            email: req.body.email
        })
    
        if (check) {
            throw new AppError("Email already exist.", 400);
        }
        
        let cart = {}
    
        for (let i = 0; i < 300; i++) {
            cart[i] = 0
        }
        
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cartData: cart
        })
    
        await user.save()
    
        const data = {
            user: {
                id: user._id
            }
        }
    
        const token = jwt.sign(data, 'secret_ecom');
        res.json({
            success: true,
            token: token
        })
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        let user = await User.findOne({
            email: req.body.email
        })
        
        if (user) {
            const passCompare = req.body.password === user.password
    
            if (passCompare) {
                const data = {
                    user: {
                        id: user._id
                    }
                }
    
                const token = jwt.sign(data, 'secret_ecom')
                res.json({
                    success: true,
                    token: token,
                    cartData: user.cartData
                })
            } else {
                throw new AppError ("Wrong password.", 401);
            }
        } else {
            throw new AppError ("User not found.", 404);
        }
    } catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const userID= req.user.id;
        const updateUser= await User.findByIdAndUpdate(
            userID, 
            {$set: req.body},
            {new: true});
        if (!updateUser) {
            throw new AppError ("Can not update user.", 404);
        }
        res.status(200).json({
            success: true,
            data: updateUser
        });
    } catch (error) {
        next(error)
    }
}

exports.updateUserAddress = async (req, res, next) => {
    try {
        const addressUpdate = new Address({
            street: req.body.street,
            city: req.body.city,
            country: req.body.country
        })
        const userUpdate= await User.findOneAndUpdate({_id: req.user.id}, {selectAddress: addressUpdate}, {new: true});
        if(!this.updateUserAddress) throw new AppError("Cannot update user address.", 404);
        res.json({
            status: 200,
            data: userUpdate
        })
    } catch (error) {
        next(error);
    }
}

exports.addToCart = async (req, res, next) => {
    try {
        let userData = await User.findOne({
            _id: req.user.id
        })
        if(!userData) {
            throw new AppError ("User not found.", 404);
        }

        if (user.cartData[itemId] === undefined) {
            throw new AppError("Invalid item ID.", 400);
        }
        userData.cartData[req.body.itemId] += 1
        const updateCart = await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData }, {new: true});
        if(!updateCart) {
            throw new AppError ("Can not update cart.", 500);
        }
        
        res.send("Updated cart data for user");
    } catch (error) {
        next(error);
    }
}

exports.removeFromCart = async (req, res, next) => {
    try {
        let userData = await User.findOne({
            _id: req.user.id
        })
    
        if(!userData) throw new AppError ("User not found.", 404);
    
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1
        }
    
        const updateCart = await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData }, {new: true});
        
        if(!updateCart) throw new AppError ("Can not update cart.", 500);
        
        res.status(200).json({
            success: true,
            message: "Removed items from cart successfully."
        });
    } catch (error) {
      next(error);
    }
}

exports.getCart = async (req, res, next) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            throw new AppError ("User not found.", 404);
        }
        res.json(userData.cartData)
    } catch (err) {
        next(err);
    }
}

exports.myInfo = async (req, res, next) => {
    const user = await User.findById({_id: req.user.id})
    try {
        if(!user) throw new AppError ("User not found.", 404);

        const userObject = user.toObject();
        delete userObject.cartData;
        res.json({
            status: 200,
            data: userObject
        });
    } catch (error) {
        next(error);
    }
}