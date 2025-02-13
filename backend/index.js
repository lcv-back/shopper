const port = 4000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const { error } = require('console')

const dir = './upload/images';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

app.use(express.json())
app.use(cors()) 

// database connection with mongodb
mongoose.connect(`mongodb+srv://haoda:PsLp8YoJq35rS5bN@anhhao.uqdvc.mongodb.net/`)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error:", err))

// api creation
app.get("/", (req, res) => {
    res.send("Hello World")
})

// image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${ file.fieldname }_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
})

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: 0,
            message: "No file uploaded"
        });
    }

    const imageUrl = `http://localhost:${port}/images/${req.file.filename}`;

    console.log('Image uploaded successfully. Image URL:', imageUrl);

    res.json({
        success: 1,
        image_url: imageUrl
    });
});


// schema for creating products
const Product = mongoose.model('product', {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
})

app.post('/addproduct', async(req, res) => {
    let products = await Product.find({})
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
    console.log(product)
    await product.save()
    console.log('Product added successfully')
    res.json({
        success: true,
        name: req.body.name
    })
})

// Creating API for deleting products
app.post('/removeproduct', async(req, res) => {
    await Product.findOneAndDelete({
        id: req.body.id
    })

    console.log("Product deleted successfully")
    res.json({
        success: true,
        name: req.body.name
    })
})

// Creating API for getting all products
app.get('/allproducts', async(req, res) => {
    let products = await Product.find({})
    res.json(products)
})

// Schema creating for user model
const Users = mongoose.model('Users', {
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
    date: {
        type: Date,
        default: Date.now
    }
})

// Creating endpoint for registing the user
app.post('/signup', async(req, res) => {
    let check = await Users.findOne({
        email: req.body.email
    })

    if (check) {
        return res.status(400).json({
            success: false,
            errors: "Email already exists"
        })
    }

    let cart = {}

    for (let i = 0; i < 300; i++) {
        cart[i] = 0
    }

    const user = new Users({
        name: req.body.username,
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

    const token = jwt.sign(data, 'secret_ecom')
    res.json({
        success: true,
        token: token
    })
})

// creating endpoint for use login
app.post('/login', async(req, res) => {
    let user = await Users.findOne({
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
            res.json({
                success: false,
                errors: "Invalid password"
            })
        }
    } else {
        res.json({
            success: false,
            errors: "Email already in use or invalid"
        })
    }
})

// creating endpoint for new collection data
app.get('/newcollections', async(req, res) => {
    let products = await Product.find({})
    let newcollection = products.slice(1).slice(-8)
    res.send(newcollection)
})

// creating endpoint popular in women section
app.get('/popularwomen', async(req, res) => {
    let products = await Product.find({
        category: 'women'
    })
    let popularwomen = products.slice(0, 4)
    res.send(popularwomen)
})

// creating middleware to fetch user
const fetchUser = async(req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ errors: 'No token, authorization denied' });
    }
    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({ errors: "Invalid token" });
    }
};


// creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async(req, res) => {
    let userData = await Users.findOne({
        _id: req.user.id
    })

    userData.cartData[req.body.itemId] += 1
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })
    res.send("Updated cart data for user")
})

// creating endpoints to remove product from cartdata
app.post('/removefromcart', fetchUser, async(req, res) => {
    let userData = await Users.findOne({
        _id: req.user.id
    })

    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1
    }

    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })
    res.send("Removed items from cart successfully")
})

// creating endpoint to get user's cart data
app.post('/getcart', fetchUser, async(req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(userData.cartData)
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// order schema
const Order = mongoose.model('order', {
    userId: {type: String,required: true},
    items: {type: Object},
    totalPrice: {type: String, required: true},
    payment: {
        type: {type: String, required: true},
        name: {type: String, required: true},
        number: {type: String, required: true},
        expired: {type: String, required: true},
        cvc: {type: String, required: true},
        status: {type: String, default: "paid"}
    },
    status: {type: String, default: "pending"},
    shipAddress: {
        address: {type: String, required: true},
        city: {type: String, required: true},
        country: {type: String, required: true}
    },
    createAt: {type: Date, default: Date.now}
})

// totalPrice
const totalPrice = async (cartData) => {
    let total = 0;
    for(const [key, quantity] of Object.entries(cartData)) {
        if(quantity > 0) {
            let product = await Product.findOne({id: key})
            total += product.new_price * quantity
        }
    }

    let tax = 0.05 * total;
    let shippingPrice = 10;

    return total + tax + shippingPrice;
} 

//filted cart 
const filterdCartItems = (cartData) => {
    return Object.entries(cartData)
            .filter(([_, quantity]) => quantity > 0)
            .reduce((filteredCart, [key, quantity]) => {
                filteredCart[key] = quantity;
                return filteredCart;
            }, {});
}

// creating api checkout
app.post('/docheckout', fetchUser, async(req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    let total = await totalPrice(userData.cartData);
    let newOrder = new Order({
        userId: req.user.id,
        items: filterdCartItems(userData.cartData),
        totalPrice: total,
        payment: {
            type: req.body.payment.type,
            name: req.body.payment.name,
            number: req.body.payment.number,
            expired: req.body.payment.expired,
            cvc: req.body.payment.cvc,
            status: req.body.payment.status
        },
        shipAddress: {
            address: req.body.shipAddress.address,
            city: req.body.shipAddress.city,
            country: req.body.shipAddress.country
        }
    })

    let cart = userData.cartData;
    Object.keys(cart).forEach(key => {
        cart[key] = 0;
    });
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: cart });

    
    await newOrder.save();

    res.json({
        success: true,
        data: newOrder
    })
})

//api get all order
app.get('/getorders', async(req, res) => {
    let orders = await Order.find({})
    res.json(orders)
})


app.listen(port, (error) => {
    if (!error) {
        console.log(`Server is running on port ${port}`)
    } else {
        console.log(`Error: ${error}`)
    }
})