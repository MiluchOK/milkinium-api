module.exports = class CodedError extends Error {
    constructor(message, status) {
        super(message)
        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);
        
        // You can use any additional properties you want.
        // I'm going to use preferred HTTP status for this error types.
        // `500` is the default value if not specified.
        this.status = status || 500;
    }
}