"use strict";
const http = require('http');
const urlOpts = {host: 'localhost', path: '/', port: '3002', method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}};
let contentLehgtn = 0;
let request = http.request(urlOpts, (res) => {
  res.on('data', (chunk) => {
    console.log(chunk.toString());
  });
}).on('error', (e) => {
  console.log('error: ' + e.stack);
});
process.argv.forEach((postItem, index) => {
  if (index > 1) {
    contentLehgtn += postItem.length;
    request.write(`${postItem}`);
  }
});
request.end();
