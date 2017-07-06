const key = {}

// Handle keys
addEventListener('keydown', e => {
  console.log(e.which)
  key[e.which] = true
})
addEventListener('keyup', e => {
  console.log(e.which)
  key[e.which] = false
})

// Keyboard controls
export const RETURN = key[13]
export const SHIFT = key[16]
export const ESC = key[27]
export const W = key[87]
export const S = key[83]
export const A = key[65]
export const D = key[68]
export const SPACE = key[74]
export const J = key[73]
export const K = key[75]
