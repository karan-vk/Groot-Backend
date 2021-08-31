const express = require('express');
const { compression, cors, docs, responseTime, cache } = require('./plugins');
const limiter = require("./auth/rate-limiter");
const throttle = require("./auth/rate-throttle");
const forceHttps = require('@crystallize/elasticloadbalancer-express-force-https');


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
server.use(throttle);
server.use("/docs", docs.UI, docs.DOCS);
server.use(forceHttps());
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
server.use("/payments", require("./payments"));
server.get("/", cache.route(60 * 60 * 24), (req, res) => {
    res.status(200).sendFile(__dirname + "/index/index.html");
});
server.use(cache.route(60 * 60 * 24), (req, res, next) => {
    res.status(404);


    if (req.accepts('html')) {
        res.sendFile(__dirname + "/index/404.html");
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

server.use(cache.route({
    expire: {
        404: 5,
        409: 5,
        default: 0
    }
}))

module.exports = server;