"use strict";

const http = require('http');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
  '.js' : 'text/javascript',
  '.html' : 'text/html',
  '.css' : 'text/css'
};

let cache = {
  store: {},
  maxSize: 26214400, // (bytes) 25mb
  maxAge: 5400 * 1000, //(ms) 1 and a half hours
  cleanAfter: 7200 * 1000, //(ms) two hours
  cleanedAt: 0, //to be set dynamically
  clean: function(now) {
    if (now - this.cleanAfter > this.cleanedAt) {
      this.cleanedAt = now;
      let that = this;
      Object.keys(this.store).forEach(function(file) {
        if (now > that.store[file].timestamp + that.maxAge) {
          delete that.store[file];
        }
      });
    }
  }
};

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
      fs.stat(f, (err, stats) => {
        if (stats.size < cache.maxSize) {
          let bufferOffset = 0;
          cache.store[f] = {content: new Buffer(stats.size), timestamp: Date.now()};
          s.on('data', (data) => {
            data.copy(cache.store[f].content, bufferOffset);
            bufferOffset += data.length;
          });
        }
      });
      s.pipe(res);
      return;
    }
    res.writeHead(404);
    res.end();
  });
  cache.clean(Date.now());
});

server.listen(3002);
