/**
 * Compiles shader from source
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @param {number} type
 */
export function compileShader (gl, source, type) {
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
export function createShaderProgram (gl, vsSource, fsSource) {
  const program = gl.createProgram()
  const vShader = compileShader(gl, vsSource, gl.VERTEX_SHADER)
  const fShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER)
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
