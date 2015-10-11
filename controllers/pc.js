'use strict';

const parser = require('ua-parser-js'),
  mongoose = require('mongoose');

const pc = {
  create: (req, res, next) => {
    const PcModel = mongoose.model('pc'),
      ua = parser(req.headers['user-agent']),
      ioTime = parseFloat(req.body.ioTime),
      ioScale = parseInt(req.body.ioScale, 10),
      calcTime = parseFloat(req.body.calcTime),
      calcScale = parseInt(req.body.calcScale, 10);

    let pcModel = new PcModel({
      ua: ua.ua,
      browser: {
        name: ua.browser.name,
        version: ua.browser.version,
        major: ua.browser.major
      },
      engine: ua.engine,
      os: ua.os,
      io: {
        time: ioTime,
        scale: ioScale
      },
      calc: {
        time: calcTime,
        scale: calcScale
      },
      ratio: ioTime / calcTime
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
    const PcModel = mongoose.model('pc'),
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
