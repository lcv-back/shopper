const port = 4000
const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs')
const { error } = require('console')

const connectDB = require('./upload/configs/db');

const upload = require('./upload/middlewares/uploadMiddleware');
const fetchUser = require('./upload/middlewares/authMiddleware');
const errorHandler = require('./upload/middlewares/errorHandler');

const { uploadImage } = require('./upload/controllers/uploadController');
const productController = require('./upload/controllers/productController');
const userController = require('./upload/controllers/userController');
const orderController = require('./upload/controllers/orderController');
const discountController = require('./upload/controllers/discountController');
const emailController = require('./upload/controllers/emailController');
const addressController = require('./upload/controllers/addressController');
const paymentController = require('./upload/controllers/paymentController');

app.use(express.json())
app.use(cors()) 

// database connection with mongodb
connectDB();

// API creation
app.get("/", (req, res) => {
    res.send("Hello World")
})

const dir = './upload/images'; // định nghĩa đường dẫn lưu trữ ảnh
// tạo mới nếu không có thư mục
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}
// cho phép truy cập thư mục thông qua URL 
app.use("/images", express.static("upload/images"));

// API FOR UPLOAD IMAGE
//---------------------
app.post("/upload", upload.single("product"), uploadImage);

// API FOR PRODUCT
//----------------
// add
app.post('/addproduct', productController.createProduct);
// delete
app.post('/removeproduct', productController.deleteProduct)
// get all
app.get('/allproducts', productController.getAllProducts)
// get new collection data
app.get('/newcollections', productController.newCollection);
// get popular in women section
app.get('/popularwomen', productController.popularWomen);

// API FOR USER
//-------------
// registing
app.post('/signup', userController.registing);
// login
app.post('/login', userController.login);
// update
app.put('/users', fetchUser, userController.updateUser);
// update user address
app.put('/users/address', fetchUser, userController.updateUserAddress);
// adding products in cartdata
app.post('/addtocart', fetchUser, userController.addToCart);
// remove product from cartdata
app.post('/removefromcart', fetchUser, userController.removeFromCart);
// get user's cart data
app.post('/getcart', fetchUser, userController.getCart);
// get user info
app.get('/myInfo', fetchUser, userController.myInfo);

// API FOR ORDER
//--------------
// checkout
app.post('/orders', fetchUser, orderController.checkout);
// get all
app.get('/orders', orderController.getAllOrder);
// update
app.put('/orders/:orderId', orderController.updateOrder);

// API FOR DISCOUNT
//-----------------
// add
app.post('/discounts', discountController.addDiscount);
// get all
app.get('/discounts', discountController.getAllDiscount);
// get by code
app.get('/discounts/:code', discountController.getDiscountByCode);
// delete
app.delete('/discounts', discountController.deleteDiscount);

// API FOR EMAIL
//---------------
// send email
app.post('/sendmail', fetchUser, emailController.sendEmail);

// API FOR ADDRESS
//----------------
// add
app.post('/address', fetchUser, addressController.addAddress);
// get all
app.get('/address', fetchUser, addressController.getAllAddress);
// update
app.put('/address/:addressId', fetchUser, addressController.updateAddress);
// delete
app.delete('/address/:addressId', addressController.deleteAddress);

// API FOR PAYMENT
//----------------
// add
app.post('/payment', fetchUser, paymentController.addPayment);
// get all
app.get('/payments', fetchUser, paymentController.getAllPayment);
// update
app.put('/payments/:paymentId', paymentController.updatePayment);
// delete
app.delete('/payment/:paymentId', fetchUser, paymentController.deletePayment);


app.use(errorHandler);

app.listen(port, (error) => {
    if (!error) {
        console.log(`Server is running on port ${port}`)
    } else {
        console.log(`Error: ${error}`)
    }
})