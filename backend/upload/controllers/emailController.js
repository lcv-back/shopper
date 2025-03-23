const nodemailer = require('nodemailer');
require ('dotenv').config();
const User = require('../models/User');
const AppError = require('../helpers/appError');

exports.sendEmail = async (req, res, next) => {
    try {
        let user= await User.findOne({ _id: req.user.id });

        if(!user) throw new AppError ("User not found.", 404);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
    
        const htmlEmailReply = `
            <div class="content">
                <h1>
                Order Confirmation - Thank You for Your Purchase!
                </h1>
                <p>
                Dear ${user.name},
                </p>
                <p>
                Thank you for choosing Shopper Store! We are thrilled to confirm your order ${req.body.orderId} placed on ${new Date().toDateString()}. Your support means the world to us, and we are excited to have you as a valued customer.
                </p>
                <p>
                Here are the details of your order:
                </p>
                <ul>
                <li>
                Total Amount: ${req.body.totalPrice} $
                </li>
                <li>
                Shipping Address: ${req.body.address}
                </li>
                </ul>
                <p>
                We are currently processing your order and will notify you once it has shipped. If you have any questions or need further assistance, please don’t hesitate to reach out.
                </p>
                <p>
                Thank you once again for shopping with us! We hope you love your new clothes!
                </p>
                <p>
                Best regards,
                </p>
                <p>
                The Shopper Team
                <br/>
                Shopper Store
                <br/>
                <a href="http://localhost:3000/">
                shopper.com
                </a>
                </p>
            </div>
            <div class="footer">
            <p>
                © 2025 Shopper. All rights reserved.
            </p>
            </div>
        `;
    
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: 'Order Success',
            html: htmlEmailReply
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                throw new AppError ("Can not send email.", 500);
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({
                    success: true,
                    message: 'Email sent successfully'
                });
            }
        });
    } catch (error) {
        next(error);
    }
} 