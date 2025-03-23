const Product = require('../models/Product');
const AppError = require('../helpers/appError');

exports.createProduct= async (req, res, next) => {
    try {
        let products = await Product.find({})

        if(products.length === 0 || !products) throw new AppError ("No product available.", 404);

        let id
    
        if (products.length > 0) {
            let last_product_array = products.slice(-1)
            let last_product = last_product_array[0]
            id = last_product.id + 1
        } else {
            id = 1
        }
    
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price
        })

        const createProduct = await product.save();
        if(!createProduct) throw new AppError ("Can not create product.", 500);
        console.log('Product added successfully')
        res.json({
            success: true,
            name: req.body.name
        })
    } catch (error) {
        next(error);
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const deleteProduct = await Product.findOneAndDelete({
            id: req.body.id
        })
        
        if(!deleteProduct) throw new AppError ("Can not delete product.", 500);

        console.log("Product deleted successfully")
        res.json({
            success: true,
            name: req.body.name
        })
    } catch (error) {
        next(error);
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        let products = await Product.find({})
        if (products.length === 0 || !products) throw new AppError ("No product availble.", 404);
        res.json(products)
    } catch (error) {
        next(error);
    }
}

exports.newCollection = async (req, res, next) => {
    try {
        let products = await Product.find({});
        if (products.length === 0 || !products) throw new AppError ("No product availble.", 404);
        let newcollection = products.slice(1).slice(-8);
        res.send(newcollection);
    } catch (error) {
        next(error);
    }
}

exports.popularWomen = async (req, res, next) => {
    try {
        let products = await Product.find({
            category: 'women'
        })
        if (products.length === 0 || !products) throw new AppError ("No women product availble.", 404);
        let popularwomen = products.slice(0, 4);
        res.send(popularwomen);
    } catch (error) {
        next(error);
    }
}