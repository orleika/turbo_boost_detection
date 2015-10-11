'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const pcSchema = new Schema({
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
  io: {
    time: Number,
    scale: Number
  },
  calc: {
    time: Number,
    scale: Number
  },
  ratio: Number,
  turboBoost: Boolean,
  userName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'pc'
});

module.exports = mongoose.model('pc', pcSchema);
