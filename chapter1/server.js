"use strict";

const http = require('http');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
  '.js' : 'text/javascript',
  '.html' : 'text/html',
  '.css' : 'text/css'
};

const server = http.createServer();

server.on('request', (req, res) => {
  let lookup = path.basename(decodeURI(req.url)) || 'index.html';
  var f = `chapter1/content/${lookup}`;
  if (req.url === '/favicon.ico') {
    console.log(`Not found: ${f}`);
    res.end();
    return;
  }
  fs.access(f, fs.R_OK, (err) => {
    if (!err) {
      fs.readFile(f, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Server Error!');
          return;
        }
        let headers = {'Content-type': mimeTypes[path.extname(lookup)]};
        res.writeHead(200, headers);
        res.end(data);
      });
      return;
    }
    res.writeHead(404);
    res.end();
  });
});

server.listen(3002);
