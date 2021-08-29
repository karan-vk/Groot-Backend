const express = require('express');
const { compression, cors, docs, responseTime, cache } = require('./plugins');



// var methodOverride = require('method-override')
const limiter = require("./auth/rate-limiter");

const server = express();

server.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

server.use(compression)
server.use(cors)
server.use(limiter);
server.use("/docs", docs.UI, docs.DOCS);
server.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}))
server.use(express.json())
server.use(responseTime)


server.use("/user", require("./user"));
server.use("/image", require("./image"));
server.use("/tree", require("./tree"));
server.use("/fund", require("./fund"));
server.get("/test", (_, res) => {
    return res.json({ "test": "test" });
})
server.use(cache.route({
    expire: {
        404: 5,
        409: 5,
        default: 0
    }
}))


// server.use(methodOverride())
module.exports = server;