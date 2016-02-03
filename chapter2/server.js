"use strict";
const http = require('http');
const formidable = require('formidable');
const form = require('fs').readFileSync('chapter2/form.html');
const server = http.createServer();

server.on('request', (req, res) => {
  if (req.method === "GET") {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(form);
  }
  if (req.method === "POST") {
    let incoming = new formidable.IncomingForm();
    incoming.uploadDir = 'chapter2/uploads';
    incoming.on('file', (field, file) => {
      if (!file.size) {
        return;
      }
    }).on('end', () => {
      res.end('All files received');
    });
    incoming.parse(req);
  }
}).listen(3002);
