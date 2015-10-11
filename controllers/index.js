'use strict';

const fs = require('fs');

let controllers = {};

fs.readdirSync(`${__dirname}/`).forEach((file) => {
  if (file.includes('.js') && !file.includes('index')) {
    let fileName = file.substring(0, file.indexOf('.'));
    controllers[fileName] = require(`./${fileName}`);
  }
});

module.exports = controllers;
