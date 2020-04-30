/**
 * A requestAnimationFrame wrapper / polyfill.
 *
 * @param callback {Function} The callback to be invoked before the next repaint.
 * @param root {HTMLElement} The root element for the repaint
 */
export default (() => {
  // Check for request animation Frame support
  const requestFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame;
  let isNative = !!requestFrame;

  if (
    requestFrame &&
    !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())
  ) {
    isNative = false;
  }

  if (isNative) {
    return (callback, root) => {
      requestFrame(callback, root);
    };
  }

  const TARGET_FPS = 60;
  let requests = {};
  // eslint-disable-next-line no-unused-vars
  let requestCount = 0;
  let rafHandle = 1;
  let intervalHandle = null;
  let lastActive = +new Date();

  // eslint-disable-next-line func-names
  return function(callback) {
    const callbackHandle = rafHandle++;

    // Store callback
    requests[callbackHandle] = callback;
    requestCount++;

    // Create timeout at first request
    if (intervalHandle === null) {
      intervalHandle = setInterval(() => {
        // eslint-disable-next-line no-shadow
        const time = +new Date();
        const currentRequests = requests;

        // Reset data structure before executing callbacks
        requests = {};
        requestCount = 0;

        for (const key in currentRequests) {
          if (currentRequests.hasOwnProperty(key)) {
            currentRequests[key](time);
            lastActive = time;
          }
        }

        // Disable the timeout when nothing happens for a certain
        // period of time
        if (time - lastActive > 2500) {
          clearInterval(intervalHandle);
          intervalHandle = null;
        }
      }, 1000 / TARGET_FPS);
    }

    return callbackHandle;
  };
})();
