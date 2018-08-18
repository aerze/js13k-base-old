/**
 * @typedef {Array<Number>} Matrix
 */

/**
  * @returns {Matrix}
  */
export function identity () {
  return [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ]
}

/**
 * @param {number} tx
 * @param {number} ty
 * @returns {Matrix}
 */
export function translate (tx, ty) {
  return [
    1, 0, 0,
    0, 1, 0,
    tx, ty, 1
  ]
}

/**
 * @param {number} radians
 * @returns {Matrix}
 */
export function rotation (radians) {
  const c = Math.cos(radians)
  const s = Math.sin(radians)
  return [
    c, -s, 0,
    s, c, 0,
    0, 0, 1
  ]
}

/**
 * @param {number} sx
 * @param {number} sy
 * @returns {Matrix}
 */
export function scaling (sx, sy) {
  return [
    sx, 0, 0,
    0, sy, 0,
    0, 0, 1
  ]
}

export function projection (width, height) {
  return [
    2 / width, 0, 0,
    0, -2 / height, 0,
    -1, 1, 1
  ]
}

/**
 * @param {Matrix} a
 * @param {Matrix} b
 * @returns {Matrix}
 */
export function multiply (a, b) {
  return [
    b[0] * a[0] + b[1] * a[3] + b[2] * a[6],
    b[0] * a[1] + b[1] * a[4] + b[2] * a[7],
    b[0] * a[2] + b[1] * a[5] + b[2] * a[8],
    b[3] * a[0] + b[4] * a[3] + b[5] * a[6],
    b[3] * a[1] + b[4] * a[4] + b[5] * a[7],
    b[3] * a[2] + b[4] * a[5] + b[5] * a[8],
    b[6] * a[0] + b[7] * a[3] + b[8] * a[6],
    b[6] * a[1] + b[7] * a[4] + b[8] * a[7],
    b[6] * a[2] + b[7] * a[5] + b[8] * a[8],
  ]
}
