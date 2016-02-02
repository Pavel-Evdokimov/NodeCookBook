"use strict"
const http = require('http');
const server = http.createServer();
server.on('request', (req, res) => {
  console.log(req.method);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Cool');
});

server.listen(3002);
