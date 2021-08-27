const express = require('express');
const { compression, cors } = require('./plugins');


// var methodOverride = require('method-override')
const limiter = require("./auth/rate-limiter");
const morgan = require('morgan');
const server = express();

server.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});
// server.use(morgan)
server.use(compression)
server.use(cors)
server.use(limiter);

server.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}))
server.use(express.json())

server.use("/user", require("./user"));
server.use("/image", require("./image"));
server.use("/tree", require("./tree"));
server.get("/test", (_, res) => {
    return res.json({ "test": "test" });
})


// server.use(methodOverride())
module.exports = server;