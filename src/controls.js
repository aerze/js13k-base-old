const key = {}

// Handle keys
addEventListener('keydown', e => key[e.which] = true)

addEventListener('keyup', e => key[e.which] = false)

// Keyboard controls

function keys () {
  return {
    shift: key[16],

    return: key[13],
    start: key[13],

    esc: key[27],
    cancel: key[27],

    w: key[87],
    up: key[87],

    s: key[83],
    down: key[83],

    a: key[65],
    left: key[65],

    d: key[68],
    right: key[68],

    space: key[32],
    jump: key[32],

    j: key[73],
    button1: key[73],

    k: key[75],
    button2: key[75]
  }
}

export default keys
