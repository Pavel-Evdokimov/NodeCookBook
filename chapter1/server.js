"use strict"
const http = require('http');
const path = require('path');
let pages = [
  {route: '', output: 'Wooho!'},
  {route: 'about', output: 'A simple routing with Node exapmle'},
  {route: 'another page', output: function() {return 'Here\s' + this.route;}}
]

const server = http.createServer();
server.on('request', (req, res) => {
  let lookup = path.basename(decodeURI(req.url));
  pages.forEach((page) => {
    if (page.route === lookup) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(typeof page.output === 'function' ? page.output() : page.output);
    }
  });
  if (!res.finished) {
    res.writeHead(404);
    res.end('Page Not Found!');
  }
});

server.listen(3002);
