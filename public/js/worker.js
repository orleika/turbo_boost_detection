(function() {
  'use strict';

  self.addEventListener('message', function(e) {
    var type = e.data.type,
      scale = e.data.scale,
      result;
    if (type === 'io') {
      result = io(scale);
    } else if (type === 'calc') {
      result = calc(scale);
    }
    self.postMessage(result);
  }, false);

  function calc(n) {
    var rad = 180 / Math.PI,
      sum = 0;
    for (var i = 0; i < n; i++) {
      sum += Math.sin(rad * i) * Math.cos(rad * i);
    }
    return sum;
  }

  function io(n) {
    var uInt8Array = new Uint8Array(1024 * 1024 * n),
      tmp;
    for (var i = 0; i < uInt8Array.length; i++) {
      uInt8Array[i] = 1;
    }
    for (i = 0; i < uInt8Array.length; i++) {
      tmp = uInt8Array[i];
    }
  }
}());
