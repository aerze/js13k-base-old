/**
 * Returns a snapshot of all pressed keys
 * @memberof Katalyst
 * @returns {{
    shift: boolean,
    return: boolean,
    start: boolean,
    esc: boolean,
    cancel: boolean,
    w: boolean,
    up: boolean,
    s: boolean,
    down: boolean,
    a: boolean,
    left: boolean,
    d: boolean,
    right: boolean,
    space: boolean,
    jump: boolean,
    j: boolean,
    button1: boolean,
    k: boolean,
    button2: boolean
  }}
 */
function Controls () {
  return {
    shift: Controls.keys[16],

    return: Controls.keys[13],
    start: Controls.keys[13],

    esc: Controls.keys[27],
    cancel: Controls.keys[27],

    w: Controls.keys[87],
    up: Controls.keys[87],

    s: Controls.keys[83],
    down: Controls.keys[83],

    a: Controls.keys[65],
    left: Controls.keys[65],

    d: Controls.keys[68],
    right: Controls.keys[68],

    space: Controls.keys[32],
    jump: Controls.keys[32],

    j: Controls.keys[73],
    button1: Controls.keys[73],

    k: Controls.keys[75],
    button2: Controls.keys[75]
  }
}

Controls.keys = {}

// Handle keys
addEventListener('keydown', e => Controls.keys[e.which] = true)
addEventListener('keyup', e => Controls.keys[e.which] = false)

export default Controls
