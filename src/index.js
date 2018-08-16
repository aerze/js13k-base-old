import Input from './input'
const x = 0
const y = 1
const vert = `#version 300 es
in vec2 a_pos;

uniform vec2 u_res;
uniform mat3 u_mat;

void main() {
  vec2 pos = (u_mat * vec3(a_pos, 1)).xy;
  vec2 zOne = pos / u_res;
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
    this.matLoc = gl.getUniformLocation(program, 'u_mat')
    // this.transLoc = gl.getUniformLocation(program, 'u_trans')
    // this.rotLoc = gl.getUniformLocation(program, 'u_rot')
    // this.scaleLoc = gl.getUniformLocation(program, 'u_scale')

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

    Input.init()

    this.scale = [1, 1]
    this.angle = 0
    this.trans = [0, 0]

    this.render()
  }

  /**
   * @param {number} now ms
   */
  render (now) {
    const { gl, program } = this
    const delta = (now || 0) - this.then
    console.log(`delta`, delta)
    this.then = now

    Core.resize(gl.canvas)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl['bindVertexArray'](this.vao)
    gl.uniform2f(this.resLoc, gl.canvas.width, gl.canvas.height)

    this.update(delta)

    gl.drawArrays(gl.TRIANGLES, 0, 18)

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
    if (Input.isDown.zoomIn) this.scale = this.scale.map(c => c + 0.2)
    if (Input.isDown.zoomOut) this.scale = this.scale.map(c => c - 0.2)
    if (Input.isDown.rotRight) this.angle -= Math.PI * 0.02
    if (Input.isDown.rotLeft) this.angle += Math.PI * 0.02
    if (Input.isDown.up) this.trans[y] -= 5
    if (Input.isDown.down) this.trans[y] += 5
    if (Input.isDown.left) this.trans[x] -= 5
    if (Input.isDown.right) this.trans[x] += 5
    if (Input.isDown.stop) this.go = false

    const translationMat = this.translate(this.trans[x], this.trans[y])
    const rotationMat = this.rotation(this.angle)
    const scaleMat = this.scaling(this.scale[x], this.scale[y])

    const matrix = this.multiply(this.multiply(translationMat, rotationMat), scaleMat)

    this.gl.uniformMatrix3fv(this.matLoc, false, matrix)
    this.setGeometry(this.gl)
  }

  translate (tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1
    ]
  }

  rotation (radians) {
    const c = Math.cos(radians)
    const s = Math.sin(radians)
    return [
      c, -s, 0,
      s, c, 0,
      0, 0, 1
    ]
  }

  scaling (sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1
    ]
  }

  multiply (a, b) {
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

  setRect () {
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

  setGeometry (gl) {
    const width = 100
    const height = 150
    const thickness = 30
    const x = 0
    const y = 0
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // left column
        x, y,
        x + thickness, y,
        x, y + height,
        x, y + height,
        x + thickness, y,
        x + thickness, y + height,

        // top rung
        x + thickness, y,
        x + width, y,
        x + thickness, y + thickness,
        x + thickness, y + thickness,
        x + width, y,
        x + width, y + thickness,

        // middle rung
        x + thickness, y + thickness * 2,
        x + width * 2 / 3, y + thickness * 2,
        x + thickness, y + thickness * 3,
        x + thickness, y + thickness * 3,
        x + width * 2 / 3, y + thickness * 2,
        x + width * 2 / 3, y + thickness * 3]),
      gl.STATIC_DRAW)

    gl.uniform4f(this.colLoc, 1, 0, 1, 1)
  }
}

const { body } = window.document
const canvas = document.createElement('canvas')
canvas.width = body.clientWidth
canvas.height = body.clientHeight
body.appendChild(canvas)

const K = new Core(canvas)
K.init()
