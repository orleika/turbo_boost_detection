'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var pcSchema = new Schema({
  ua: String,
  browser: {
    name: String,
    version: String,
    major: String
  },
  engine: {
    name: String,
    version: String
  },
  os: {
    name: String,
    version: String
  },
  single: Number,
  multi: Number,
  ratio: Number,
  scale: Number,
  thread: Number,
  turboBoost: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'pc'
});

module.exports = mongoose.model('pc', pcSchema);
