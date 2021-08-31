const slowDown = require("express-slow-down");
const speedLimiter = slowDown({
    windowMs: 5 * 60 * 1000, // 15 minutes
    delayAfter: 200, // allow 100 requests per 15 minutes, then...
    delayMs: 100, // begin adding 500ms of delay per request above 100:
    skipFailedRequests: false,
    skipSuccessfulRequests: true,
    maxDelayMs: 1000, // max possible delay is 1000ms
    onLimitReached: (req, res, options) => {
        res.status(429).send("Too Many Requests");
    },
});

module.exports = speedLimiter;