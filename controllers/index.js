'use strict';

var fs = require('fs'),
  controllers = {};

fs.readdirSync(__dirname + '/').forEach((file) => {
  if (~file.indexOf('.js') && !~file.indexOf('index')) {
    let fileName = file.substring(0, file.indexOf('.'));
    controllers[fileName] = require('./' + fileName);
  }
});

module.exports = controllers;
