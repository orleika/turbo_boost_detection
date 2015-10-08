'use strict';

var parser = require('ua-parser-js'),
  mongoose = require('mongoose');

var pc = {
  create: (req, res, next) => {
    var PcModel = mongoose.model('pc'),
      ua = parser(req.headers['user-agent']),
      single = parseFloat(req.body.single),
      multi = parseFloat(req.body.multi),
      scale = parseInt(req.body.scale, 10),
      thread = parseInt(req.body.thread, 10);

    let pcModel = new PcModel({
      ua: ua.ua,
      browser: {
        name: ua.browser.name,
        version: ua.browser.version,
        major: ua.browser.major
      },
      engine: ua.engine,
      os: ua.os,
      single: single,
      multi: multi,
      ratio: multi / single,
      scale: scale,
      thread: thread
    });
    pcModel.save((err, pc) => {
      if (err) {
        return next(err);
      }
      return res.json({
        id: pc._id,
        ratio: pc.ratio
      });
    });
  },
  update: (req, res, next) => {
    var PcModel = mongoose.model('pc'),
      id = req.body.id,
      ratio = parseFloat(req.body.ratio),
      name = req.body.name;

    PcModel.findById(id, (err, pc) => {
      if (pc.ratio !== ratio) {
        return res.status(400).json({
          id: pc._id
        });
      }
      pc.userName = name;
      pc.save((err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          id: pc._id
        });
      });
    });
  }
};

module.exports = pc;
