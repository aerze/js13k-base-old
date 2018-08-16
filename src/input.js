const Input = {
  /**
   * @param {KeyboardEvent} e
   */
  handleKey (e) {
    const key = this.map[e.keyCode]
    const isDown = e.type === 'keydown'
    this.isDown[key] = isDown
    if (!key) console.log(e.key, e.keyCode)
  },

  init () {
    window.addEventListener('keydown', this.handleKey.bind(this))
    window.addEventListener('keyup', this.handleKey.bind(this))
  },

  map: {
    '37': 'left',
    '38': 'up',
    '39': 'right',
    '40': 'down',
    '65': 'left',
    '87': 'up',
    '68': 'right',
    '83': 'down',
    '69': 'rotRight',
    '81': 'rotLeft',
    '82': 'zoomIn',
    '70': 'zoomOut',
    'undefined': 'undefined'
  },

  isDown: {
    up: false,
    down: false,
    left: false,
    right: false,
    rotRight: false,
    rotLeft: false,
    zoomIn: false,
    zoomOut: false,
    undefined: false
  }
}

export default Input
