const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    statusCode: 429,
    message: "Too many requests, please try again later.",
    skipSuccessfulRequests: false,

});

module.exports = limiter;