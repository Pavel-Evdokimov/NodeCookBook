"use strict";
let jsonProfiles = require('./profiles');
let stringifyedProfiles = JSON.stringify(jsonProfiles);
jsonProfiles = JSON.parse(stringifyedProfiles.replace(/name/g, 'fullname'));
console.log(jsonProfiles.felix.fullname);
