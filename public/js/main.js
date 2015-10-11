(function(window, $, undefined) {
  'use strict';

  function compareNumbers(a, b) {
    return a - b;
  }

  function sum(arr) {
    return arr.reduce(function(a, b) {
      return a + b;
    });
  }

  function average(arr) {
    return sum(arr) / arr.length;
  }

  function median(arr, fn) {
    arr.sort(fn);
    arr.pop();
    arr.shift();
    return average(arr);
  }

  function single(type, scale, callback) {
    function recieve() {
      callback(window.performance.now() - start);
      worker.terminate();
    }
    var worker = new Worker('js/worker.js');
    worker.addEventListener('message', recieve, false);
    worker.postMessage({
      type: type,
      scale: scale
    });
    var start = window.performance.now();
  }

  function multi(n, type, scale, callback) {
    var c = 0,
      result = [];
    (function(done) {
      for (var i = 0; i < n; i++) {
        single(type, scale, done);
      }
    }(function(time) {
      c++;
      result.push(time);
      if (c === n) {
        callback(median(result, compareNumbers));
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
    var ioScale = 100,
      calcScale = 2000000,
      startInput = false,
      startInputTime = 0;

    multi(5, 'io', ioScale, function(ioTime) {
      multi(5, 'calc', calcScale, function(calcTime) {
        var data = {
          ioTime: ioTime,
          ioScale: ioScale,
          calcTime: calcTime,
          calcScale: calcScale
        };
        console.log(data);
        console.log('ratio:', ioTime / calcTime);
        create(data).then(function(res) {
          $('#result').text('ratio: ' + (ioTime / calcTime)).css('font-weight', '700');
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
