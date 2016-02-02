"use strict"
const http = require('http');
const url = require('url');

let pages = [
  {id: '1', route: '', output: 'Woohoo!'},
  {id: '2', route: 'about', output: 'A simple routing with Node example'},
  {id: '3', route: 'another page', output: function() {
    return 'Here\'s ' + this.route;
  }}
];

const server = http.createServer();
server.on('request', (req, res) => {
  let id = url.parse(decodeURI(req.url), true).query.id;
  if (id) {
    pages.forEach((page) => {
      if (page.id === id) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(typeof page.output === 'function' ? page.output() : page.output);
      }
    });
  }
  if (!res.finished) {
    res.writeHead(404);
    res.end('Page Not Found!');
  }
});

server.listen(3002);
