import Katalyst from './katalyst'
import hero from './demo_hero'

const canvas = document.getElementById('c')
const imageSrc = 'images.png'

Katalyst(canvas, imageSrc, (game) => {
  const menu = game.addScene('menu')
  const group = menu.addGroup('hero')
  group.addEntity(hero)
})
