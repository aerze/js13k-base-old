const keys = {}

// Handle keys
addEventListener('keydown', e => keys[e.which] = true)

addEventListener('keyup', e => keys[e.which] = false)

// keyboard controls
function controls () {
  return {
    shift: keys[16],

    return: keys[13],
    start: keys[13],

    esc: keys[27],
    cancel: keys[27],

    w: keys[87],
    up: keys[87],

    s: keys[83],
    down: keys[83],

    a: keys[65],
    left: keys[65],

    d: keys[68],
    right: keys[68],

    space: keys[32],
    jump: keys[32],

    j: keys[73],
    button1: keys[73],

    k: keys[75],
    button2: keys[75]
  }
}

export default controls
