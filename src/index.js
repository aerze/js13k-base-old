import Game from './game'
import Entity from './entity'
import Sprite from './sprite'
import Rect from './rect'

const framesets = [[
  {x:156,y:18,width:12,height:18},
  {x:180,y:18,width:12,height:18},
  {x:168,y:18,width:12,height:18},
  {x:132,y:18,width:12,height:18}
]]

const heroSprite = new Sprite(framesets, { x: 1, y: 1 }, { x: 4, y: 4 })
const hero = new Entity(3, 10, 10, [0, 0, 12, 18], [heroSprite], () => {}, 0)

/**
 * fires when engine had loaded
 * @param {Game} game
 */
function play (game) {
  console.log(game.engine.layers)
  game.engine.layers[3].push(hero)
}

const game = new Game(document.getElementById('c'), 'images.png', play)
