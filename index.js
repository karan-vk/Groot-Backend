require('dotenv').config()
const server = require('./src')
const PORT = process.env.PORT || 3000
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, 'sslcert/selfsigned.key'));
const certificate = fs.readFileSync(path.join(__dirname, 'sslcert/selfsigned.crt'));
const http = require('http');
const https = require('https');

const credentials = { key: privateKey, cert: certificate };
const httpServer = http.createServer(server);
const httpsServer = https.createServer(credentials, server);
// server.listen(PORT, (e) => {

//   console.log(`server listening on ${PORT} 🚀`)
// })
httpServer.listen(PORT, () => {
  console.log('server running at ' + PORT)
});
https.createServer(httpsServer, server)
  .listen(443, () => {
    console.log('server running at ' + 443)
  })