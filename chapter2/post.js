"use strict";
const http = require('http');
const fs = require('fs');
let boundary = Date.now();
let urlOpts = {host: 'localhost', path: '/', port: '3002', method: 'POST'};
urlOpts.headers = {'Content-Type': `multipart/form-data; boundary="${boundary}"`}

boundary = `--${boundary}`;
let request = http.request(urlOpts, (response) => {
  response.on('data', (chunk) => {
    // console.log(chunk.toString());
  });
}).on('error', (e) => {
  console.log('error: ' + e.stack);
});

(function multipartAssembler(files) {
  let f = files.shift(), fSize = fs.statSync(f).size;
  let progress = 0;
  let fReadStream = fs.createReadStream(f);
  fReadStream.once('open', () => {
    request.write(boundary + '\r\n' +
      'Content-Disposition: ' +
      'form-data; name="userfile"; filename="' + f + '"r\n' +
      'Content-Type: application/octet-stream\r\n' +
      'Content-Transfer-Encoding: binary\r\n\r\n');
    });
  fReadStream.on('data', (chunk) => {
    console.log(chunk);
    request.write(chunk);
    progress += chunk.length;
    // console.log(`${f}:${Math.round((progress / fSize) * 10000) / 100}%`);
  });
  fReadStream.on('end', () => {
    if (files.length) {
      multipartAssembler(files);
      return; //early finish
    }
    // any code placed here wont execute until no files are left
    // due to early return from function
    request.end('\r\n' + boundary + '--\r\n\r\n\r\n');
  });
}(process.argv.splice(2, process.argv.length)));
