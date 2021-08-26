require('dotenv').config()
const server = require('./src')
const PORT = process.env.PORT || 3000

server.listen(PORT, (e) => {

  console.log(`server listening on ${PORT}`)
})
