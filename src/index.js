const express = require('express');
var bodyParser = require('body-parser')
// var methodOverride = require('method-override')
const server = express();
server.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});
server.use(bodyParser.urlencoded({
    extended: true
}))
server.use(bodyParser.json())

server.use("/user", require("./user"));
// server.use(methodOverride())
module.exports = server;