const { Router } = require('express');
const { S3 } = require('../aws');
const { redis } = require('../redis');
const image = Router();

const senderStream = (res, params) => {
    S3.getObject(params).on('httpHeaders', function (statusCode, headers) {
        res.set('Content-Length', headers['content-length']);
        res.set('Content-Type', headers['content-type']);
        this.response.httpResponse.createUnbufferedStream()
            .pipe(res);
    })
        .send()
}
const senderBuffer = (res, params, nocache = false) => {

    if (!nocache) {
        // redis.exists(params.Key).then(exist => {
        // if (exist == 1) {

        redis.getBuffer(params.Key).then(buffer => {
            redis.expire(params.Key, 60);
            res.write(buffer);
            return res.end();
        }).catch((err) => { });
        // } else {

        //     console.log('cache miss');
        // }
        // })
    }

    S3.getObject(params, (err, data) => {
        if (err) {
            res.status(400).json(err);
        } else {
            if (!nocache) { redis.setBuffer(params.Key, data.Body, "EX", 60); }
            res.write(data.Body);
            res.end();
        }
    });
}

image.get("/user/:user", (req, res) => {
    const { user } = req.params;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${user}/Profile.png`
    };
    if (req.query.media === 'true') {
        return senderBuffer(res, params);
    }
    return senderStream(res, params);


})
image.get("/user/:user/thumb", (req, res) => {
    const { user } = req.params;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${user}/ProfileThumb.png`
    };
    if (req.query.media === 'true') {
        return senderBuffer(res, params, req.query.nocache);
    }
    return senderStream(res, params)
})

module.exports = image;