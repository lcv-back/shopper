const port = 4000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
const jwt = require('jsonwebtoken')

const dir = './upload/images';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

app.use(express.json())
app.use(cors())

// database connection with mongodb
mongoose.connect(`mongodb+srv://lecongvi18052002:lecongvi1805@shopboavimap.imum6.mongodb.net/`)
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
    console.log("All products fetched successfully")
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
                token: token
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
    console.log("New collection fetched")
    res.send(newcollection)
})

// creating endpoint popular in women section
app.get('/popularwomen', async(req, res) => {
    let products = await Product.find({
        category: 'women'
    })
})


app.listen(port, (error) => {
    if (!error) {
        console.log(`Server is running on port ${port}`)
    } else {
        console.log(`Error: ${error}`)
    }
})