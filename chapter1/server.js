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

const server = http.createServer();

server.on('request', (req, res) => {
  let lookup = path.basename(decodeURI(req.url)) || 'index.html';
  let f = `chapter1/content/${lookup}`;
  if (req.url === '/favicon.ico') {
    console.log(`Not found: ${f}`);
    res.end();
    return;
  }
  fs.access(f, fs.R_OK, (err) => {
    if (!err) {
      let headers = {'Content-type': mimeTypes[path.extname(f)]};
      if (cache[f]) {
        res.writeHead(200, headers);
        res.end(cache[f].content);
        return;
      }
      let s = fs.createReadStream(f);
      let ws = fs.createWriteStream(`chapter1/content/index2.html`);
      s.once('open', () => {
        res.writeHead(200, headers);
      }).once('error', (e) => {
        console.log(e);
        res.writeHead(500);
        res.end('Server Error!');
      });
      s.on('data', (chunk) => {
      });
      fs.stat(f, (err, stats) => {
        let bufferOffset = 0;
        cache[f] = {content: new Buffer(stats.size)};
        s.on('data', (chunk) => {
          chunk.copy(cache[f].content, bufferOffset);
          bufferOffset += chunk.length;
        });
      });
      s.pipe(res);
      return;
    }
    res.writeHead(404);
    res.end();
  });
});

server.listen(3002);
