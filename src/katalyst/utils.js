/**
 * @memberof Katalyst
 */
const Utils = {
  addEventListener: document.addEventListener,
  rand: Math.random,
  floor: Math.floor,
  ceil: Math.ceil,
  min: Math.min,
  max: Math.max,

  /**
   * Returns a random integer
   * @param {number} min
   * @param {number} max
   */
  randInt (min, max) {
    return Utils.floor(Utils.rand() * (max - min + 1)) + min
  }
}

export default Utils
