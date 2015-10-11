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

  function create(data) {
    return $.ajax({
      type: 'POST',
      url: 'api/result',
      data: data
    });
  }

  function update(data) {
    return $.ajax({
      type: 'POST',
      url: 'api/update',
      data: data
    });
  }

  var scale = 1000000,
    thread = 5,
    startInput = false,
    startInputTime = 0;

  $(function() {
    multi(thread, scale, function(multiTime) {
      single(scale, function(singleTime) {
        var data = {
          single: singleTime,
          multi: multiTime,
          scale: scale,
          thread: thread
        };
        console.log('ratio:', multiTime / singleTime);
        create(data).then(function(res) {
          $('#status').text('ratio:' + (multiTime / singleTime)).css('font-weight', '700');
          setInterval(function() {
            if (startInput && 2000 < Date.now() - startInputTime) {
              var data = {
                id: res.id,
                ratio: res.ratio,
                name: $('#name').val()
              };
              update(data).then(function() {
                startInput = false;
                $('#name').css('border-color', '#2BBBAD');
              });
            }
          }, 1000);
        });
      });
    });
  });

  function startInputEvent() {
    startInput = true;
    $('#name').css('border-color', '#9E9E9E');
    startInputTime = Date.now();
  }

  $('#name').on('keypress', startInputEvent);

}(window, jQuery));
