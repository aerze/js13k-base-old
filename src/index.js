const vert = `#version 300 es
in vec2 a_pos;
uniform vec2 u_res;
void main() {
  vec2 zOne = a_pos / u_res;
  vec2 zTwo = zOne * 2.0;
  vec2 clip = zTwo - 1.0;
  gl_Position = vec4(clip * vec2(1, -1), 0, 1);
}`
const frag = `#version 300 es
precision mediump float;
uniform vec4 u_col;
out vec4 outColor;
void main() {
  outColor = u_col;
}`

class Core {
  /**
   * Compiles shader from source
   * @param {WebGLRenderingContext} gl
   * @param {string} source
   * @param {number} type
   */
  static compileShader (gl, source, type) {
    var shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    const shaderInfo = gl.getShaderInfoLog(shader)
    if (shaderInfo) console.log(shaderInfo)
    if (success) return shader

    gl.deleteShader(shader)
    throw Error('Shader failed to compile')
  }

  /**
   * Creates a program using 2 shaders
   * @param {WebGLRenderingContext} gl
   * @param {string} vsSource - vertex shader
   * @param {string} fsSource - fragment shader
   */
  static createShaderProgram (gl, vsSource, fsSource) {
    const program = gl.createProgram()
    const vShader = Core.compileShader(gl, vsSource, gl.VERTEX_SHADER)
    const fShader = Core.compileShader(gl, fsSource, gl.FRAGMENT_SHADER)
    gl.attachShader(program, vShader)
    gl.attachShader(program, fShader)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    const programInfo = gl.getProgramInfoLog(program)
    if (programInfo) console.log(programInfo)
    if (success) return program

    gl.deleteProgram(program)
    throw Error('Program failed to link')
  }

  /**
   * Make the drawing buffer match the size of the stretched canvas
   * @param {HTMLCanvasElement} canvas
   */
  static resize (canvas) {
    // css pixels to real pixels
    // const ratio = window.devicePixelRatio || 1
    const ratio = 1
    const { clientWidth, clientHeight, width, height } = canvas
    const displayWidth = Math.floor(clientWidth * ratio)
    const displayHeight = Math.floor(clientHeight * ratio)

    if (width !== displayWidth || height !== displayHeight) {
      canvas.width = clientWidth
      canvas.height = clientHeight
    }
  }

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor (canvas) {
    this.gl = canvas.getContext('webgl2')
    if (!this.gl) throw new Error('Missing WebGL2 context')
    this.program = Core.createShaderProgram(this.gl, vert, frag)
    this.render = this.render.bind(this)

    this.go = true
    this.then = 0
    this.box = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      color: [1, 1, 0]
    }
  }

  init () {
    const { gl, program } = this

    this.posLoc = gl.getAttribLocation(program, 'a_pos')
    this.resLoc = gl.getUniformLocation(program, 'u_res')
    this.colLoc = gl.getUniformLocation(program, 'u_col')

    this.positions = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30]),
      gl.DYNAMIC_DRAW
    )

    this.vao = gl['createVertexArray']()
    gl['bindVertexArray'](this.vao)
    gl.enableVertexAttribArray(this.posLoc)

    gl.vertexAttribPointer(this.posLoc, 2, gl.FLOAT, false, 0, 0)

    this.render()
  }

  /**
   * @param {number} now ms
   */
  render (now) {
    const { gl, program } = this
    const delta = (now || 0) - this.then
    this.then = now

    Core.resize(gl.canvas)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl['bindVertexArray'](this.vao)
    gl.uniform2f(this.resLoc, gl.canvas.width, gl.canvas.height)

    this.update(delta)

    gl.drawArrays(gl.TRIANGLES, 0, 6)

    if (this.go) {
      requestAnimationFrame(this.render)
    }
  }

  // update gl.ARRAY_BUFFER
  // update color
  /**
   * @param {number} delta ms
   */
  update (delta) {
    const r = Math.random()
    const g = Math.random()
    const b = Math.random()
    this.box.x = r * 100
    this.box.y = g * 100
    this.box.width = this.box.height = b * 100
    this.box.color = [r, g, b]

    const { gl } = this
    const { x, y, width, height, color } = this.box

    const left = x
    const right = x + width
    const top = y
    const bottom = y + height

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        left,
        top,
        right,
        top,
        left,
        bottom,
        left,
        bottom,
        right,
        top,
        right,
        bottom
      ]),
      gl.DYNAMIC_DRAW
    )
    gl.uniform4f(this.colLoc, color[0], color[1], color[2], 1)
  }
}

const { body } = window.document
const canvas = document.createElement('canvas')
canvas.width = body.clientWidth
canvas.height = body.clientHeight
body.appendChild(canvas)

const K = new Core(canvas)
K.init()

body.addEventListener('click', () => {
  K.go = false
})
