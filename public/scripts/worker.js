(function() {
  'use strict';

  self.addEventListener('message', function(e) {
    var scale = e.data;
    var result = load(scale);
    self.postMessage(result);
  }, false);

  function load(n) {
    var rad = 180 / Math.PI,
      sum = 0;
    for(var i = 0; i < n; i++) {
      sum += Math.sin(rad * i) * Math.cos(rad * i);
    }
    return sum;
  }
}());
