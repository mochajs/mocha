// Only add setZeroTimeout to the window object, and hide everything else in a closure.
(function() {

  var timeouts = [],
      messageName = 'zero-timeout-message';

  // Like setTimeout, but only takes a function argument.  There's
  // no time argument (always zero) and no arguments (you have to
  // use a closure).
  function setZeroTimeoutPostMessage(fn) {
    timeouts.push(fn);
    window.postMessage(messageName, '*');
  }

  function setZeroTimeout(fn) {
    setTimeout(fn, 0);
  }

  function handleMessage(event) {
    if (event.source == window && event.data == messageName) {
      if (event.stopPropagation) {
        event.stopPropagation();
      }
      if (timeouts.length) {
        timeouts.shift()();
      }
    }
  }

  if (window.postMessage) {
    if (window.addEventListener) {
      window.addEventListener('message', handleMessage, true);
    } else if (window.attachEvent) {
      window.attachEvent('onmessage', handleMessage);
    }
    window.setZeroTimeout = setZeroTimeoutPostMessage;
  } else {
    window.setZeroTimeout = setZeroTimeout;
  }

}());