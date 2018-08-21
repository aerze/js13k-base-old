import Core from './core'
import Input from './input'


const { body } = window.document
const canvas = document.createElement('canvas')
canvas.width = body.clientWidth
canvas.height = body.clientHeight
body.appendChild(canvas)

const K = new Core(canvas, [Input])
