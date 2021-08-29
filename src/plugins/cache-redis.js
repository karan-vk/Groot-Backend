const cache = require('express-redis-cache')({
    host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, auth_pass: process.env.REDIS_PASSWORD, prefix: 'cache'
});
cache.on('connected', function () {
    console.log('Redis Cache connected');
});

cache.on('message', function (message) {
    console.log('Redis Cache message: ' + message);
});

const cacheFeedSetName = (req, res, next) => {
    if (req.user) {
        res.express_redis_cache_name = 'feed:user-' + req.user.user;
    } else {
        res.express_redis_cache_name = 'feed:public';
    }
    next();
}
const cacheLikeSetName = (req, res, next) => {

    res.express_redis_cache_name = 'like:user-' + req.user.user;

    next();
}
const noCacheQuery = (req, res, next) => {
    if (req.query.nocache) {
        res.use_express_redis_cache = false;
    }
    next();
}

module.exports = {
    cache,
    cacheFeedSetName,
    noCacheQuery, cacheLikeSetName
};