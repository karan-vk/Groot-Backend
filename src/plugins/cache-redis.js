const cache = require('express-redis-cache')({
    host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, auth_pass: process.env.REDIS_PASSWORD, prefix: 'cache'
});


module.exports = {
    cache
};