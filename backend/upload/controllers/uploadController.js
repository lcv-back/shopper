const AppError = require('../helpers/appError');

exports.uploadImage = (req, res, next) => {
    try {
        if(!req.file) {
            throw new AppError ("No file upload", 400);
        }
    
        const imageUrl = `http://localhost:4000/images/${req.file.filename}`;
    
        res.json({
            success: 1,
            image_url: imageUrl
        })
    } catch (error) {
        next(error);
    }
}
