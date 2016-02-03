"use strict";
const http = require('http');
const querystring = require('querystring');
const util = require('util');
const form = require('fs').readFileSync('chapter2/form.html');
const maxData = 2 * 1024 * 1024; // 2mb
const server = http.createServer();

server.on('request', (req, res) => {
  if (req.method === "GET") {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(form);
  }
  if (req.method === "POST") {
    let postData = '';
    req.on('data', (chunk) => {
      postData += chunk;
      if (postData.length > maxData) {
        postData = '';
        this.destroy();
        res.writeHead(413); // Request Entity Too Large
        res.end('Too large');
      }
    });
    req.on('end', () => {
      if (!postData) {
        res.end();
        return; // Prevents empty post requests from chashing the server
      }
      let postDataObject = querystring.parse(postData);
      console.log(`User Posted:\n${postData}`);
      res.end(`You Posted:\n${util.inspect(postDataObject)}`);
    });
  }
}).listen(3002);
