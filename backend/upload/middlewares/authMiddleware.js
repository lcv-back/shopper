const jwt = require('jsonwebtoken')

const authMiddleware = async(req, res, next) => {
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

module.exports = authMiddleware;