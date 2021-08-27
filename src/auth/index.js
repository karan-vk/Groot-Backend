const jwt = require("jsonwebtoken");
var express = require('express')
var app = express()

app.use(function (req, res, next) {
    console.log('Time:', Date.now())
    next()
})
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "access denied! punk" });
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = { authenticateJWT };