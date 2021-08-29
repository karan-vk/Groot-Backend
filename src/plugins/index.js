const compression = require('./compression');
const cors = require('./cors');
const docs = require('./swagger');
const { cache } = require("./cache-redis")
const responseTime = require('./response-time')


module.exports = {
    compression,
    cors,
    docs,
    cache,
    responseTime


}