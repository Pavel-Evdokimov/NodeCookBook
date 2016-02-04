"use strict";
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const form = fs.readFileSync('chapter2/put_upload_form.html');
const server = http.createServer();

server.on('request', (req, res) => {
  if (req.method === "PUT") {
    let fileData = new Buffer(+req.headers['content-length']);
    let bufferOffset = 0;
    req.on('data', (chunk) => {
      chunk.copy(fileData, bufferOffset);
      bufferOffset += chunk.length;
    }).on('end', () => {
      let rand = (Math.random()*Math.random()).toString(16).replace('.', '');
      let to = 'chapter2/uploads/' + rand + "-" + req.headers['x-uploadedfilename'];

      fs.writeFile(to, fileData, (err) => {
        if (err) {
          throw err;
        }
        console.log('Saved file to ' + to);
        res.end();
      });
    });
  }
  if (req.method === "GET") {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(form);
  }
  if (req.method === "POST") {
    console.log(req);
    let incoming = new formidable.IncomingForm();
    incoming.uploadDir = 'chapter2/uploads';

    incoming.on('fileBegin', (field, file) => {
      if (file.name) {
        file.path += "-" + file.name;
      }
    }).on('file', (field, file) => {
      if (!file.size) {
        return;
      }
    }).on('field', (field, value) => {
      res.write(`${field} : ${value}\n`);
    }).on('end', () => {
      res.end('All files received');
    });
    incoming.parse(req);
  }
}).listen(3002);
