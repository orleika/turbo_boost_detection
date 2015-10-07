'use strict';

var controllers = require('./controllers'),
  express = require('express'),
  router = express.Router();

router.get('/', (req, res) => {
  res.json({
    ok: true
  });
});

router.post('/result', controllers.pc.create);

module.exports = router;
