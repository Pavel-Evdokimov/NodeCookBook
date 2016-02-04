"use strict";
const http = require('http');
const url = require('url');
const profiles = require('./profiles');

const server = http.createServer();
server.on('request', (req, res) => {
  let urlObj = url.parse(req.url, true);
  let cb = urlObj.query.callback;
  let who = urlObj.query.who;
  let profile;

  if (cb && who) {
    profile = `${cb}(${JSON.stringify(profiles[who])})`;
    console.log(profile);
    res.end(profile);
  }
});
server.listen(3002);
