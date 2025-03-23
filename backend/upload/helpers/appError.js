class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor); //giữ cho stack trace chính xác
    }
}

module.exports = AppError;