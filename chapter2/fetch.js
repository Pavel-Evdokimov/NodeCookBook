"use strict";
const http = require('http');
const url = require('url');
let urlOpts = {host: 'www.chebit24.ru', path: '/', port: '80'};

if (process.argv[2]) {
  if (!process.argv[2].match('http://')) {
    process.argv[2] = 'http://' + process.argv[2];
  }
  console.log(process.argv[2]);
  urlOpts = url.parse(process.argv[2]);
  console.log(urlOpts);
}

http.get(urlOpts, (res) => {
  res.on('data', (chunk) => {
    console.log(chunk.toString());
  }).on('error', (e) => {
    console.log(`error: ${e.message}`);
  });
});
