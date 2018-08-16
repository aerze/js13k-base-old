export const UNDEFINED = 0
export const UP = 1
export const DOWN = 2
export const LEFT = 3
export const RIGHT = 4
export const ROT_RIGHT = 5
export const ROT_LEFT = 6
export const ZOOM_IN = 7
export const ZOOM_OUT = 8
export const STOP = 9

export const isDown = Array(10).fill(false)
export const init = () => {
  window.addEventListener('keydown', handleKey)
  window.addEventListener('keyup', handleKey)
}

const map = {
  8: STOP,
  37: LEFT,
  38: UP,
  39: RIGHT,
  40: DOWN,
  65: LEFT,
  87: UP,
  68: RIGHT,
  83: DOWN,
  69: ROT_RIGHT,
  81: ROT_LEFT,
  82: ZOOM_IN,
  70: ZOOM_OUT,
  'undefined': UNDEFINED
}

/**
 * @param {KeyboardEvent} e
 */
function handleKey (e) {
  console.log(e.key, e.keyCode)
  const key = map[e.keyCode] || UNDEFINED
  isDown[key] = e.type === 'keydown'
}
