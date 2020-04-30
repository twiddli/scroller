// Easing Equations (c) 2003 Robert Penner, all rights reserved.
// Open source under the BSD License.

/**
 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
 **/
export const easeOutCubic = (pos) => Math.pow(pos - 1, 3) + 1;

/**
 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
 **/
export const easeInOutCubic = (pos) => {
  // eslint-disable-next-line no-cond-assign
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 3);
  }

  return 0.5 * (Math.pow(pos - 2, 3) + 2);
};
