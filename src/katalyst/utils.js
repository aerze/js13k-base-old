// Function shortcuts
export const addEventListener = document.addEventListener
export const rand = Math.random
export const floor = Math.floor
export const ceil = Math.ceil
export const min = Math.min
export const max = Math.max

// Utility Functions
export default {
  randInt: (min, max) => floor(rand() * (max - min + 1)) + min
}
