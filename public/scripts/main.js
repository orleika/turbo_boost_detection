(function(window, $, undefined) {
  'use strict';

  function single(scale, callback) {
    function recieve() {
      callback(window.performance.now() - start);
      worker.terminate();
    }
    var worker = new Worker('scripts/worker.js');
    worker.addEventListener('message', recieve, false);
    worker.postMessage(scale);
    var start = window.performance.now();
  }

  function multi(n, scale, callback) {
    var c = 0,
      totalTime = 0;
    (function(done) {
      for (var i = 0; i < n; i++) {
        single(scale / n, done);
      }
    }(function(time) {
      c++;
      totalTime += time;
      if (c === n) {
        callback(totalTime);
      }
    }));
  }

  function send(data) {
    return $.ajax({
      type: 'POST',
      url: 'https://sanderia.gq/api/result',
      data: data
    });
  }

  function result(data) {
    $('#status').text(data).css('font-weight', '700');
  }

  var scale = 10000000,
    thread = 10;

  multi(thread, scale, function(multiTime) {
    single(scale, function(singleTime) {
      var data = {
        single: singleTime,
        multi: multiTime,
        scale: scale,
        thread: thread
      };
      send(data).then(function() {
        result('ratio:' + (multiTime / singleTime));
      });
    });
  });
}(window, jQuery));
