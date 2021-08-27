const cors = require('cors')


const corsOptions = cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

module.exports = corsOptions