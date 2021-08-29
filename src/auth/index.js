const jwt = require("jsonwebtoken");
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
const authenticateJWTOPT = (req, res, next) => {
    if (req.headers.authorization) {
        authenticateJWT(req, res, next);
    } else {
        next()
    }


}

module.exports = { authenticateJWT, authenticateJWTOPT };