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

  $(function() {
    var scale = 1000000,
      thread = 5,
      startInput = false,
      startInputTime = 0;

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
          $('#result').text('ratio:' + (multiTime / singleTime)).css('font-weight', '700');
          setInterval(function() {
            if (startInput && 1500 < Date.now() - startInputTime && $('#name').val() !== '') {
              var data = {
                id: res.id,
                ratio: res.ratio,
                name: $('#name').val()
              };
              update(data)
                .done(function() {
                  $('#updateStatus').addClass('has-success');
                  $('#updateStatusIcon').addClass('glyphicon-ok').show();
                }).fail(function() {
                  $('#updateStatus').addClass('has-error');
                  $('#updateStatusIcon').addClass('glyphicon-remove').show();
                }).always(function() {
                  startInput = false;
                });
            }
          }, 1000);
        });
      });
    });

    function startInputEvent() {
      startInput = true;
      $('#updateStatus').removeClass('has-success has-error');
      $('#updateStatusIcon').removeClass('glyphicon-ok glyphicon-remove').hide();
      startInputTime = Date.now();
    }

    $('#name').on('keypress', startInputEvent);
  });

}(window, jQuery));
