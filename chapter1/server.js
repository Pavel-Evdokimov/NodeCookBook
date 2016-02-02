"use strict";

const http = require('http');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
  '.js' : 'text/javascript',
  '.html' : 'text/html',
  '.css' : 'text/css'
};

let cache = {};
function cacheAndDeliver(f, cb) {
  if (!cache[f]) {
    fs.readFile(f, (err, data) => {
      if (!err) {
        cache[f] = {content: data};
      }
      cb(err, data);
    });
    return;
  }
  console.log(`loading ${f} from cache`);
  cb(null, cache[f].content);
}

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
      cacheAndDeliver(f, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Server Error!');
          return;
        }
        let headers = {'Content-type': mimeTypes[path.extname(f)]};
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
