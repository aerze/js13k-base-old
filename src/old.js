import {TinyCanvas, CreateTexture} from './libs/tiny-canvas'

/* ===================================================================================================
 NOTES
 =====================================================================================================
 All variables starting with C_ are constants and should never show up in compiled code as is.
 -----------------------------------------------------------------------------------------------------
 We load a single sprite sheet as an image and create a "texture" that is shared by all sprites.
 -----------------------------------------------------------------------------------------------------
 Everything rendered lives in this structure
 Layer > Entity > Sprite Stack > Sprite
 -----------------------------------------------------------------------------------------------------
*/

// Function shortcuts (since minifier doesn't help with these specific ones):
var rand = Math.random
var floor = Math.floor
var ceil = Math.ceil
var min = Math.min
var max = Math.max

// Small utility functions
function randInt(min, max) { return floor(rand() * (max - min + 1)) + min }

// The tiniest canvas
var canvas = TinyCanvas(document.getElementById('c'))
var canvasWidth = canvas.c.width
var canvasHeight = canvas.c.height

// Simple frame count (increments on every frame)
var frameCount = 0

// Sprite sheet image+texture that gets loaded
var spriteSheetImage = new Image()
var spriteSheetTexture

// Hero and World Settings
var C_WORLD_GRAVITY = 0.5
var C_BULLET_SPEED = 5
var C_HERO_MAX_WALK_SPEED = 4
var C_HERO_MAX_HEALTH = 1000
var C_HERO_INC_HEALTH = C_HERO_MAX_HEALTH * 0.2
var C_HERO_JUMP_LENGTH = 5 // in frames
var C_HERO_JUMP_SPEED = 6

// Game status constants
var C_STATUS_MENU       = 0
var C_STATUS_PLAYING    = 1
var C_STATUS_PAUSED     = 2
var C_STATUS_POSTGAME   = 3
var C_STATUS_KILLSCREEN = 4

// Enemy Settings
var C_ENEMY_WALK_SPEED = 3

/**
 * Game Status (state). Keeps track of whether we are at the menu, playing, paused, post-game, etc
 * @type {number}
 */
var gameStatus = C_STATUS_MENU

// Other game state
var timewarp = false
var score
var health
var shooting
var jumping
var doubleJumpUsed
var doubleJumpReady
var jumpFramesLeft
var playerEntity
var invincibleUntil

var C_FRAMESET_RED_PIXEL = [[[0, 0, 1, 1]]]
var C_FRAMESET_WHITE_PIXEL = [[[1, 0, 1, 1]]]
var C_FRAMESET_RAIN_PIXEL = [[[2, 0, 1, 1]]]
var C_FRAMESET_BULLET  = [
  // flash
  [[3, 0, 4, 4]],
  // bullet
  [[7, 0, 4, 4]]
]
var C_FRAMESET_ROCKET  = [
  // rocket
  [[11, 0, 10, 7]],
  // plasma
  [[21, 0, 6, 6]]
]
var C_FRAMESET_HERO    = [

  // Standing "frameset" (only one frame)
  [[204, 0, 18, 24]],

  // Walking frameset (example)
  [
    [222, 0, 18, 24],
    [240, 0, 18, 24],
    [258, 0, 18, 24],
    [276, 0, 18, 24]
  ]
]
var C_FRAMESET_ENEMY_1 = [[
  [142, 0, 16, 16],
  [158, 0, 16, 16],
  [174, 0, 16, 16],
  [190, 0, 16, 16]
]]
var C_FRAMESET_ENEMY_2 = [[
  [27, 0, 20, 18],
  [53, 0, 20, 18]
]]
// Layer "ids"
var C_LAYER_BACKGROUND        = 0
var C_LAYER_WORLD             = 1
var C_LAYER_ENEMIES           = 2
var C_LAYER_HERO              = 3
var C_LAYER_ENEMY_PROJECTILES = 4
var C_LAYER_HERO_PROJECTILES  = 5
var C_LAYER_FOREGROUND        = 6
var C_LAYER_UI_IN_GAME        = 7
var C_LAYER_TEXT_IN_GAME      = 8
var C_LAYER_UI_IN_MENU        = 9

// "Layers"
var layers = [

  // background
  [],

  // world
  [],

  // enemies
  [],

  // hero
  [],

  // enemy projectiles
  [],

  // hero projectiles
  [],

  // foreground
  [],

  // in-game UI
  [],

  // in-game text
  [],

  // in-menu UI
  []

]

// TODO: consider removing unused letters
// TODO: consider removing values that are consistent like Y:0 and H:5
var TEXT = {
  '0': [625,5],
  '1': [581,4],
  '2': [585,5],
  '3': [590,5],
  '4': [595,5],
  '5': [600,5],
  '6': [605,5],
  '7': [610,5],
  '8': [615,5],
  '9': [620,5],
  ' ': [630,5],
  a: [445,5],
  b: [450,5],
  c: [455,5],
  d: [460,5],
  e: [465,5],
  f: [470,5],
  g: [475,5],
  h: [480,5],
  i: [486,2],
  j: [488,5],
  k: [493,5],
  l: [498,5],
  n: [503,6],
  m: [509,6],
  o: [515,5],
  p: [520,5],
  q: [525,5],
  r: [530,5],
  s: [535,5],
  t: [540,5],
  u: [545,6],
  v: [551,6],
  w: [557,6],
  x: [563,6],
  y: [569,6],
  z: [575,6]
}

var roundPending
var roundNum
var enemiesToDefeat
var enemySpawnQueue
var C_ENEMY_TYPE_BASIC_BITCH = 0
var C_ENEMY_TYPE_MONKEY = 1
var C_ENEMY_TYPE_JUMPING_MONKEY = 2

// TODO: xy?
// round > spawn queue > spawn event
var C_ROUNDS = [
  [
    // [enemyType, delay, numberOfThatEnemyTypeToSpawn]
    [C_ENEMY_TYPE_BASIC_BITCH, 0, 5],
  ],
  [
    [C_ENEMY_TYPE_BASIC_BITCH, 0, 10],
    [C_ENEMY_TYPE_MONKEY, 200, 3],
    [C_ENEMY_TYPE_BASIC_BITCH, 400, 10]
  ],
  [
    [C_ENEMY_TYPE_BASIC_BITCH, 0, 10],
    [C_ENEMY_TYPE_MONKEY, 20, 3],
    [C_ENEMY_TYPE_JUMPING_MONKEY, 0, 5],
  ],
  [
    [C_ENEMY_TYPE_BASIC_BITCH, 0, 10],
    [C_ENEMY_TYPE_MONKEY, 20, 3],

  ],
  [
    [C_ENEMY_TYPE_BASIC_BITCH, 0, 10],
    [C_ENEMY_TYPE_MONKEY, 20, 3],
  ],
  [
    [C_ENEMY_TYPE_JUMPING_MONKEY, 0, 30],
  ],
  [
    [C_ENEMY_TYPE_BASIC_BITCH, 0, 10],
    [C_ENEMY_TYPE_MONKEY, 20, 3],
  ],
  [
    [C_ENEMY_TYPE_BASIC_BITCH, 0, 10],
    [C_ENEMY_TYPE_MONKEY, 20, 3],
  ],
  [
    [C_ENEMY_TYPE_BASIC_BITCH, 0, 10],
    [C_ENEMY_TYPE_MONKEY, 20, 3],
  ],
  [
    [C_ENEMY_TYPE_JUMPING_MONKEY, 0, 20],
    [C_ENEMY_TYPE_BASIC_BITCH, 0, 10],
    [C_ENEMY_TYPE_MONKEY, 20, 3],
  ]
]

/**
 * Checks if game status is any of the statuses passed as an array
 *
 * @param {number|Array} status Status to check if any match current game status
 *
 * @returns {boolean}
 */
function gameStatusIs(status) {
  return (status === gameStatus || (typeof status === typeof [] && status.indexOf(gameStatus) !== -1))
}

/**
 * Check if two entities are colliding
 *
 * @param {{h:number[],x:number,y:number}} e1
 * @param {{h:number[],x:number,y:number}}  e2
 *
 * @returns {boolean}
 */
function colliding(e1, e2) {
  return (
    e1.x + e1.h[0] < e2.x + e2.h[0] + e2.h[2] &&
    e1.x + e1.h[0] + e1.h[2] > e2.x + e2.h[0] &&
    e1.y + e1.h[1] < e2.y + e2.h[1] + e2.h[3] &&
    e1.y + e1.h[3] + e1.h[1] > e2.y + e2.h[1]
  )
}

/**
 * Entities need to be able to "destroy" themselves. This creates a function they can store to do so.
 *
 * @param {number} layerIndex
 * @param {number} entityIndex
 *
 * @returns {Function}
 */
function createFunctionToDestroyEntity(layerIndex, entityIndex) {
  return function() {
    layers[layerIndex][entityIndex] = null
  }
}

/**
 * Create an entity (to establish a standard interface)
 *
 * @param {number} layerIndex
 * @param {number} x initial origin position
 * @param {number} y initial origin position
 * @param {number[]} hitboxCoords (relative to origin point)
 * @param {object[]} spriteStack
 * @param {function} updateFunction
 * @param {int} [type]
 */
function createEntity(layerIndex, x, y, hitboxCoords, spriteStack, updateFunction, type) {
  var newIndex = layers[layerIndex].length
  layers[layerIndex].push({
    type: type,
    x: x,
    y: y,
    xv: 0,
    yv: 0,
    h: hitboxCoords,
    s: spriteStack,
    u: updateFunction,
    d: createFunctionToDestroyEntity(layerIndex, newIndex)
  })
}

function createStars() {

  var ss = []

  for (var i = 0; i < C_STARS_NUM; i++) {
    ss.push({
      c: 0x55FFFFFF,
      cf: 0,
      cfs: 0,
      xo: randInt(8, canvasWidth - 8),
      yo: randInt(8, canvasHeight - 8),
      fs: [[[1, 0, 1, 1]]]
    })
  }

  createEntity(C_LAYER_BACKGROUND, 0, 0, null, ss, function() {})

}

function createBuildings() {

  var ss = []

  // Two layers
  for (var i = 0; i <= 1; i++) {

    var cursor = -50

    while (cursor < canvasWidth + 50) {

      var widthForBuilding = randInt(20, 30)
      var heightForBuilding = i ? randInt(50, 140) : randInt(150, 250)

      // back layer: #07070a
      // front layer: 151521

      ss.push({
        c: i ? 0xFF211515 : 0xFF0a0707,
        cf: 0,
        cfs: 0,
        xo: cursor,
        yo: canvasHeight - heightForBuilding,
        fs: [[[1, 0, 1, 1]]],
        sx: widthForBuilding,
        sy: heightForBuilding
      })

      // Move the cursor forward our building's width plus a random amount
      //cursor += widthForBuilding + (rand() > 0.5 ? 0 : randInt(4, 20))
      cursor += widthForBuilding + (i ? 0 : randInt(0, 30))
    }

  }

  createEntity(C_LAYER_BACKGROUND, 0, 0, null, ss, function() {})

}

function createHero() {
  //console.log('createHero() called')

  createEntity(
    C_LAYER_HERO,

    // origin (x, y)
    100,
    100,

    // Hitbox
    [0, 0, 18, 24],

    // Sprite stack
    [
      // Main hero sprite
      {
        cf: 0,
        cfs: 0,
        fs: C_FRAMESET_HERO
      },

      // TODO, dashing decorator sprite
    ],

    // Update function
    function() {
      var sprite = this.s[0]
      var onGround = (this.y >= 276)

      // Check for shooting
      // TODO: add multiple weapon types?
      if (keys[C_KEY_SHOOT]) {
        if (!shooting) {
          var startX = this.x + ((sprite.f) ? 0 : 8)
          //spawnBullet(startX, self.sprite.posY + randInt(9, 11), self.lastXDirection)
          createBullet(startX, this.y + randInt(9, 11), sprite.f)
          //console.log('Spawn bullet!')

          shooting = true
        }
      } else {
        shooting = false
      }

      if (keys[C_KEY_MOVE_RIGHT]) {
        this.x = min(canvasWidth - 18, this.x + C_HERO_MAX_WALK_SPEED)
        // Set the direction (unless we are shooting+strafing)
        if (!keys[C_KEY_STRAFE]) {
          sprite.f = false // flipped => false
        }
        sprite.cfs = 1
      } else if (keys[C_KEY_MOVE_LEFT]) {
        this.x = max(0, this.x - C_HERO_MAX_WALK_SPEED)
        // Set the direction (unless we are shooting+strafing)
        if (!keys[C_KEY_STRAFE]) {
          sprite.f = true // flipped => true
        }
        sprite.cfs = 1
      } else {
        sprite.cfs = 0
      }

      // Jumping controls
      if (keys[C_KEY_JUMP]) {

        // If user is already jumping, check if the have a 2nd jump available, if so double jump!
        if (jumping && !doubleJumpUsed && doubleJumpReady) {
          jumpFramesLeft  = C_HERO_JUMP_LENGTH
          doubleJumpUsed  = true
          doubleJumpReady = false


        } else if (!jumping) {

          // If not already jumping, jump!
          onGround       = false
          jumping        = true
          jumpFramesLeft = C_HERO_JUMP_LENGTH


        }

      } else {

        // If the user is jumping but hasn't jumped a 2nd time,
        // they can now press the jump key again to use their 2nd jump
        if (jumping && !doubleJumpUsed) {
          doubleJumpReady = true
        }

      }

      // Jumping movement
      if (jumping && jumpFramesLeft > 0) {
        this.yv = -C_HERO_JUMP_SPEED
        jumpFramesLeft--

      } else if (onGround) {

        // If we are on the ground, reset jumping state
        jumping         = false
        doubleJumpUsed  = false
        doubleJumpReady = false

        // Reset falling
        this.yv = 0

      } else {
        // Apply gravity
        this.yv += C_WORLD_GRAVITY
      }

      // Set the y position (but clamp it)
      this.y = min(canvasHeight - 24, this.y + this.yv)
      playerEntity = this

      // setTint based on damage
      if (frameCount < invincibleUntil) {
        if (frameCount % 20) {
          this.tint = !this.tint
        }
      } else {
        this.tint = false
      }

      if (this.tint) {
        sprite.c = 0xFF000099
      } else {
        sprite.c = 0xFFFFFFFF
      }
    },
    C_ENEMY_TYPE_BASIC_BITCH
  )
}

function createHealthBar() {
  //console.log('createHealthBar() called')

  createEntity(
    C_LAYER_UI_IN_GAME,

    // origin (x, y)
    40,
    11,

    // Hitbox
    null,

    // Sprite stack
    [
      // background bar (white)
      {
        cf: 0,
        cfs: 0,
        xo: -1,
        yo: -1,
        fs: C_FRAMESET_WHITE_PIXEL,
        sx: C_UI_HEALTH_BAR_WIDTH + 2,
        sy: C_UI_HEALTH_BAR_HEIGHT + 2
      },

      // inner health bar (red)
      {
        cf: 0,
        cfs: 0,
        fs: C_FRAMESET_RED_PIXEL,
        sx: C_UI_HEALTH_BAR_WIDTH,
        sy: C_UI_HEALTH_BAR_HEIGHT
      }
    ],

    // Update function
    function() {
      this.s[1].sx = floor((health/C_HERO_MAX_HEALTH) * C_UI_HEALTH_BAR_WIDTH)
    }
  )
}

function createRaindrop() {
  //console.log('createRaindrop() called')

  var x = (rand() * (canvasWidth + 600)) - 300
  var y =  rand() * canvasHeight
  var xSpeed = -3 + rand() * 3 + 1.5 + C_RAIN_ANGLE
  var ySpeed = randInt(4, 9)
  var length = randInt(4, 16)
  var rotation = Math.atan2(length, xSpeed) + 1.5708

  //

  createEntity(
    C_LAYER_FOREGROUND,

    // origin (x, y)
    x,
    y,

    // Hitbox
    [0, 0, 1, 1],

    // Sprite stack
    [
      // droplet sprite
      {
        // current frame
        c: 0x77E6B48E,
        cf: 0,
        cfs: 0,
        sy: length,
        r: rotation,
        f: false,
        fs: C_FRAMESET_RAIN_PIXEL
      }
    ],

    // Update function
    function() {
      this.x += xSpeed * (timewarp ? C_RAIN_TIME_WARP_FACTOR : 1)
      this.y += ySpeed * (timewarp ? C_RAIN_TIME_WARP_FACTOR : 1)

      // If drop is out of range, regenerate it
      // TODO: update
      if (this.y > canvasHeight) {
        this.x = (rand() * (canvasWidth + 600)) - 300
        xSpeed = -3 + rand() * 3 + 1.5 + C_RAIN_ANGLE
        ySpeed = randInt(4, 9)
        rotation = Math.atan2(length, xSpeed) + 1.5708

        this.y = 0
      }
    }
  )
}

function createConfetti() {
  var x = (rand() * (canvasWidth + 600)) - 300
  var y =  rand() * canvasHeight
  var xSpeed = (-3 + rand() * 3 + 1.5) * 0.2
  var ySpeed = randInt(4, 9) * 0.3
  var length = 5
  var rotation = Math.atan2(length, randInt(-5, 5)) + 1.5708

  createEntity(
    C_LAYER_FOREGROUND,

    // origin (x, y)
    x,
    y,

    // Hitbox
    [0, 0, 1, 1],

    // Sprite stack
    [
      // droplet sprite
      {
        // current frame
        c: C_CONFETTI_COLORS[randInt(0, C_CONFETTI_COLORS.length)],
        cf: 0,
        cfs: 0,
        sx: 2,
        sy: length,
        r: rotation,
        f: false,
        fs: C_FRAMESET_WHITE_PIXEL
      }
    ],

    // Update function
    function() {
      this.x += xSpeed * (timewarp ? C_RAIN_TIME_WARP_FACTOR : 1)
      this.y += ySpeed * (timewarp ? C_RAIN_TIME_WARP_FACTOR : 1)

      // If drop is out of range, regenerate it
      // TODO: update
      if (this.y > canvasHeight) {
        this.y = 0
        this.x = (rand() * (canvasWidth + 600)) - 300
        xSpeed = (-3 + rand() * 3 + 1.5) * 0.2
        ySpeed = randInt(4, 9) * 0.3
        rotation = Math.atan2(length, xSpeed) + 1.5708
      }
    }
  )
}

/**
 * param layer {number}
 * param text {string}
 * param x {number}
 * param y {number}
 * param scale {number}
 * duration {number}
 * delay {number}
 */
function createText(layer, text, x, y, scale, duration, delay) {
  scale = scale || 1
  var runningOffsetX = 0
  var lastWidth = 0

  /**
   * param t {number} current time
   * param b {number} starting value
   * param c {number} change in value
   * param d {number} duration
   */
  var easeInOutQuint = function(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
  }

  var startingY = -10 * scale
  var endY = y

  var animStart = frameCount + (delay || 0)
  var animEnd = animStart + (duration || 1)

  createEntity(
    layer,

    // origin
    x, startingY,

    // hitbox
    [0, 0, 1, 1],

    // sprite stack
    text.toLowerCase()
      .split('')
      .map(function(char) {
        var frame = TEXT[char]
        runningOffsetX += lastWidth * scale
        lastWidth = frame[1]
        return {
          cf: 0,
          cfs: 0,
          xo: runningOffsetX,
          yo: 0,
          sx: scale,
          sy: scale,
          fs: [[[frame[0], 0, frame[1], 5]]]
        }
      }),

    function() {
      if (frameCount < animStart) return
      if (frameCount > animEnd) return
      this.y = floor(easeInOutQuint(frameCount - animStart, startingY, endY - startingY, (duration || 1)))
    }
  )
}

function createBullet(x, y, flipped) {
  //console.log('createBullet() called')

  createEntity(
    C_LAYER_HERO_PROJECTILES,
    x,
    y,
    [0, 0, 2, 4],
    [
      {
        cf: 0,
        cfs: 0,
        f: flipped,
        fs: C_FRAMESET_BULLET
      }
    ],
    function() {
      this.x += ((this.s[0].f) ? -1 : 1) * C_BULLET_SPEED
      if (this.x < -10 || this.x > canvasWidth + 10) {
        this.d()
      }
    }
  )
}

function createEnemyBasicBitch(x, y) {
  createEntity(
    C_LAYER_ENEMIES,
    x,
    y,
    [0, 0, 16, 16],
    [
      {
        cf: 0,
        cfs: 0,
        f: rand() > 0.5,
        fs: C_FRAMESET_ENEMY_1
      }
    ],
    function() {
      var sprite = this.s[0]

      if (this.x <= 0) {
        sprite.f = false
      } else if (this.x >= canvasWidth - 16) {
        sprite.f = true
      }

      this.x += ((sprite.f) ? -1 : 1) * randInt(C_ENEMY_WALK_SPEED - 1, C_ENEMY_WALK_SPEED)

      // if facing left
      //if (sprite.f) {
      //  if (this.x > playerEntity.x - 50) {
      //    this.x = max(0, this.x - randInt(C_ENEMY_WALK_SPEED - 1, C_ENEMY_WALK_SPEED))
      //  } else sprite.f = false
      //
      //} else {
      //  if (this.x < playerEntity.x + 50) {
      //    this.x = min(canvasWidth - 20, this.x + randInt(C_ENEMY_WALK_SPEED - 1, C_ENEMY_WALK_SPEED))
      //  } else sprite.f = true
      //}

      this.y = min(canvasHeight - 16, this.y + 10)
    }
  )
}

function createEnemyMonkey(x, y) {
  createEntity(
    C_LAYER_ENEMIES,
    x,
    y,
    [0, 0, 20, 18],
    [
      {
        cf: 0,
        cfs: 0,
        f: true,
        fs: C_FRAMESET_ENEMY_2
      }
    ],
    function() {
      var sprite = this.s[0]

      // if facing left
      if (sprite.f) {
        if (this.x < 50) {
          if (playerEntity.x > this.x) {
            this.x += C_ENEMY_WALK_SPEED
          } else {
            this.x = max(0, this.x - C_ENEMY_WALK_SPEED)
          }
        } else if (this.x > playerEntity.x - 50) {
          this.x = max(0, this.x - C_ENEMY_WALK_SPEED)
        } else {
          sprite.f = false
        }

      } else {
        if (this.x > canvasWidth - 50) {
          if (playerEntity.x < this.x) {
            this.x -= C_ENEMY_WALK_SPEED
          } else {
            this.x = min(canvasWidth - 20, this.x + C_ENEMY_WALK_SPEED)
          }
        } else if (this.x < playerEntity.x + 50) {
          this.x = min(canvasWidth - 20, this.x + C_ENEMY_WALK_SPEED)
        } else {
          sprite.f = true
        }
      }

      this.y = min(canvasHeight - 20, this.y + 10)
    },
    C_ENEMY_TYPE_MONKEY
  )
}

function createEnemyJumpingMonkey(x, y) {
  createEntity(
    C_LAYER_ENEMIES,
    x,
    y,
    [0, 0, 20, 18],
    [
      {
        c: 0xFFAAFFAA,
        cf: 0,
        cfs: 0,
        f: true,
        fs: C_FRAMESET_ENEMY_2,

        // Special properties (hacking for state)
        // special frame offset
        sfo: [2,3,5,7,11,13][randInt(0, 5)],

        // special speed offset
        sso: randInt(-1,1)

      }
    ],
    function() {
      var sprite = this.s[0]

      // if facing left
      if (sprite.f) {
        if (this.x < 50) {
          if (playerEntity.x > this.x) {
            this.x += C_ENEMY_WALK_SPEED
          } else {
            this.x = max(0, this.x - C_ENEMY_WALK_SPEED) // + sprite.sso (we could use this for a harder enemy type)
          }
        } else if (this.x > playerEntity.x - 50) {
          this.x = max(0, this.x - C_ENEMY_WALK_SPEED) // + sprite.sso (we could use this for a harder enemy type)
        } else {
          sprite.f = false
        }

      } else {
        if (this.x > canvasWidth - 50) {
          if (playerEntity.x < this.x) {
            this.x -= C_ENEMY_WALK_SPEED
          } else {
            this.x = min(canvasWidth - 20, this.x + C_ENEMY_WALK_SPEED) // - sprite.sso (we could use this for a harder enemy type)
          }
        } else if (this.x < playerEntity.x + 50) {
          this.x = min(canvasWidth - 20, this.x + C_ENEMY_WALK_SPEED) // - sprite.sso (we could use this for a harder enemy type)
        } else {
          sprite.f = true
        }
      }

      var hasHitGroundInitially = this.hasHitGroundInitially || false

      // Jumping
      if (hasHitGroundInitially) {

        if ((frameCount + sprite.sfo) % 30 > 15) {
          this.y -= 4
        } else {
          this.y = min(this.y + 4, canvasHeight - 20)
        }
      } else {
        // If the player hasn't hit the ground initially, apply gravity
        this.y = min(canvasHeight - 20, this.y + 10)

        if (this.y === canvasHeight - 20) {
          console.log('hit ground')
          this.hasHitGroundInitially = true
        }
      }

      //
      //if (this.y === canvasHeight - 20 && !hasHitGroundInitially) {
      //
      //}


    },
    C_ENEMY_TYPE_JUMPING_MONKEY
  )
}

function createMenu() {
  createText(C_LAYER_UI_IN_MENU, 'r0b0ts have become t00 dangerous', 90, 10, 2, 120 , 0)
  createText(C_LAYER_UI_IN_MENU, 't00 powerful', 310, 30, 2, 120, 80)
  createText(C_LAYER_UI_IN_MENU, 't00 sentient', 340, 50, 2, 120, 120)
  createText(C_LAYER_UI_IN_MENU, 'so we we made an even stronger one to wipe them out', 90, 70, 2, 120, 200)
  createText(C_LAYER_UI_IN_MENU, 'ROBO SLAYER 3ooo', 30, 100, 8, 120, 300)
  createText(C_LAYER_UI_IN_MENU, 'press enter to begin', 40, 260, 4, 120, 460)
}

function createPostMenu(score, highScore, newHighScore) {
  createText(C_LAYER_UI_IN_MENU, 'game over', 80, 60, 8, 30 ,0)
  createText(C_LAYER_UI_IN_MENU, 'score', 40, 120, 4, 40 ,80)
  createText(C_LAYER_UI_IN_MENU, score.toString(), 40, 150, 4, 40 ,80)

  createText(C_LAYER_UI_IN_MENU, 'press enter to restart', 440, 220, 2, 40 ,160)

  createText(C_LAYER_UI_IN_MENU, (newHighScore ? 'new ' : '') + 'high score', 40, 220, 4, 40 ,100)
  createText(C_LAYER_UI_IN_MENU, highScore.toString(), 40, 250, 4, 40 ,100)

}

function createRain() {
  for (var a = 0; a < C_RAIN_NUM_DROPS; a++) {
    createRaindrop()
  }
}

function updateEntity(entity) {
  if (!entity) {
    return
  }

  entity.u()
}

function drawEntitySprites(entity) {
  if (!entity) {
    return
  }

  // TODO: sprite position should be relative to entity
  // offsets could be an optional property

  // each sprite should have framesets
  // each frameset should have 1+ frames
  // each frameset should have an animation speed?
  // framesets can be named with constants
  // FRAMESET_HERO_STANDING

  // Loop through the sprite stack for the entity and draw each
  entity.s.forEach(function(sprite) {

    //if (frameCount % 3 === 0) {
    //  console.log(entity.x, entity.y)
    //  console.log(sprite.xo, sprite.yo)
    //}

    canvas.push()
    canvas.trans(
      //entity.x + ((sprite.xo || 0) * sprite.sx || 1),
      //entity.y + ((sprite.yo || 0) * sprite.sy || 1)
      entity.x + (sprite.xo || 0),
      entity.y + (sprite.yo || 0)
    )
    canvas.rot(sprite.r || 0)

    // If the sprite has a color, apply it
    if (sprite.c) {
      canvas.col = sprite.c
    }

    if (sprite.sx || sprite.sy) {
      canvas.scale(sprite.sx || 1, sprite.sy || 1)
    }

    // check if frame is valid for frameset
    var frameCheck = (sprite.cf > sprite.fs[sprite.cfs].length - 1)

    // if frameset is invalid, set default
    if (frameCheck) sprite.cf = 0

    // set frame
    var frame = sprite.fs[sprite.cfs || 0][sprite.cf || 0]


    if (frameCount % 4 === 0) {
      // check if we can increment or set back to 0
      if (frameCheck) sprite.cf = 0
      else sprite.cf++
    }

    var x1 = frame[0] / spriteSheetTexture.width
    var x2 = (frame[0] + frame[2]) / spriteSheetTexture.width
    canvas.img(
      spriteSheetTexture,
      0,
      0,
      frame[2],
      frame[3], // NOTE: this is where y-scale needs to happen
      sprite.f ? x2 : x1,       // sprite location in sheet (draw backwards if "f"/flipped)
      frame[1] / spriteSheetTexture.height,
      sprite.f ? x1 : x2,
      (frame[1] + frame[3]) / spriteSheetTexture.height
    )
    // Reset the color
    canvas.col = 0xFFFFFFFF

    canvas.pop()

  })

}

// createGame startGame createNew newGame
function startNewGame() {
  //console.log('startNewGame() called')

  // Clear the background (in case there is one left over from the last game)
  layers[C_LAYER_BACKGROUND] = []

  // Clear the Menu UI layer
  layers[C_LAYER_UI_IN_MENU] = []
  layers[C_LAYER_UI_IN_GAME] = []

  // Reset the hero layer
  layers[C_LAYER_HERO] = []

  // Reset the rain
  layers[C_LAYER_FOREGROUND] = []
  createRain()

  // Set game status...
  gameStatus = C_STATUS_PLAYING

  // Health to 100%
  health = C_HERO_MAX_HEALTH

  // Reset score
  score = 0

  // Reset timewarp
  timewarp = false

  // Reset hero state
  shooting = false
  jumping = false
  doubleJumpUsed  = false
  doubleJumpReady = false
  jumpFramesLeft = 0
  invincibleUntil = frameCount - 1

  // Current round to 0/1
  roundPending = false
  roundNum = 0
  enemiesToDefeat = 0
  enemySpawnQueue = []

  // etc, etc

  createStars()
  createBuildings()
  createHero()
  createText(C_LAYER_UI_IN_GAME, 'HEALTH', 7, 11, 1)
  createHealthBar()

}

function hurt(damage) {

  if (frameCount < invincibleUntil) {
    return
  }

  //console.log('TAKING DAMAGE! ' +  damage)
  health = Math.max(0, health - damage)
  //console.log('health => ' + health)



  if (health === 0) {
    lose()
  }

  invincibleUntil = frameCount + 10
}

function win() {
  layers[C_LAYER_ENEMIES] = []
  layers[C_LAYER_HERO_PROJECTILES] = []
  layers[C_LAYER_ENEMY_PROJECTILES] = []
  layers[C_LAYER_UI_IN_GAME] = []
  layers[C_LAYER_FOREGROUND] = []

  gameStatus = C_STATUS_KILLSCREEN

  // When you win, automatically set the high score to 13k
  localStorage[C_LS_HIGH_SCORE] = 13000

  createText(C_LAYER_UI_IN_MENU, 'YOU WIN', 125, 80, 13, 200, 0)

  var newHighScore = false

  // Update high score if appropriate
  if (score > localStorage[C_LS_HIGH_SCORE]) {
    localStorage[C_LS_HIGH_SCORE] = score
    newHighScore = true
  }

  createText(C_LAYER_UI_IN_MENU, 'press enter to restart', 440, 220, 2, 40 ,160)

  createText(C_LAYER_UI_IN_MENU, (newHighScore ? 'new ' : '') + 'high score', 40, 220, 4, 40 ,100)
  createText(C_LAYER_UI_IN_MENU, localStorage[C_LS_HIGH_SCORE].toString(), 40, 250, 4, 40 ,100)

  for (var a = 0; a < C_CONFETTI_NUM; a++) {
    createConfetti()
  }

}

function lose() {

  //console.log('game over!')
  timewarp = true

  // Reset per-game layers+entities (chained intentionally)
  layers[C_LAYER_ENEMIES] = []
  layers[C_LAYER_HERO] = []
  layers[C_LAYER_HERO_PROJECTILES] = []
  layers[C_LAYER_ENEMY_PROJECTILES] = []
  layers[C_LAYER_UI_IN_GAME] = []

  // Set game status to post-game screen
  gameStatus = C_STATUS_POSTGAME

  //console.log('score', score)

  var newHighScore = false

  // Update high score if appropriate
  localStorage[C_LS_HIGH_SCORE] = localStorage[C_LS_HIGH_SCORE] || 0

  if (score > localStorage[C_LS_HIGH_SCORE]) {
    localStorage[C_LS_HIGH_SCORE] = score
    newHighScore = true
  }

  createPostMenu(score, localStorage[C_LS_HIGH_SCORE], newHighScore)


}

// roundNum === 0
function startNextRound() {
  if (health < C_HERO_MAX_HEALTH) {
    health += min(C_HERO_INC_HEALTH, C_HERO_MAX_HEALTH - health)
  }
  var fc = frameCount

  if (C_ROUNDS.length > roundNum) {
    // initializeEnemiesForRound
    C_ROUNDS[roundNum].forEach(function(enemyGroup) {
      enemiesToDefeat += enemyGroup[2]
      enemySpawnQueue.push([enemyGroup[0], fc + enemyGroup[1], enemyGroup[2]])
    })

  } else {
    // generateRandomEnemiesForNewRound

  }

  // Display Round X message
  roundNum++

}

// OMG, code pathz so hot right now
function update() {

  // Check for start new game trigger
  if (gameStatusIs([C_STATUS_MENU, C_STATUS_POSTGAME, C_STATUS_KILLSCREEN]) && keys[C_KEY_START_GAME]) {
    startNewGame()
  }

  // Check for pause trigger
  if (keys[C_KEY_PAUSE_GAME]) {
    if (gameStatusIs(C_STATUS_PLAYING)) {
      // TODO: pause game
      //console.log('PAUSE!')
    } else if (gameStatusIs(C_STATUS_PAUSED)) {
      // TODO: resume game
      //console.log('RESUME!')
    }
  }

  // TODO: make sure certain checks/updates only run during GAME_ACTIVE_STATUS

  // Updates that should only happen in game:
  if (gameStatusIs(C_STATUS_PLAYING)) {

    if (frameCount % 10 === 0) {
      //console.log('enemies: ' + enemiesToDefeat)
    }

    if (enemiesToDefeat === 0) {

      if (roundNum === C_ROUNDS.length) {
        win()
        return
      }

      if (!roundPending) {
        roundPending = true
        createText(C_LAYER_TEXT_IN_GAME, 'Round ' + (roundNum+1), 100, 80, 4, 30, 0)
        setTimeout(function() {
          roundPending = false
          layers[C_LAYER_TEXT_IN_GAME] = []
          startNextRound()
        }, 2000)
      }

    } else {
      // Check if there are any enemies ready to spawn?
      // but only spawn one every 4th frame
      if (frameCount % 10 === 0) {
        if (enemySpawnQueue.length > 0) {
          var group = enemySpawnQueue[0]

          if (frameCount > group[1]) {
            if (group[2] === 0) {
              // pop the group off
              enemySpawnQueue.shift()
            } else {
              // spawn the type of enemy and decrement the count left of that group to spawn
              [
                createEnemyBasicBitch,
                createEnemyMonkey,
                createEnemyJumpingMonkey
              ][group[0]](randInt(20, canvasWidth - 20), 0)
              //enemiesToDefeat++
              group[2]--
            }
          }
        }
      }
    }

    // Check for timewarp
    //timewarp = !!keys[C_KEY_TIMEWARP]
  }

  layers.forEach(function(group) {
    group.forEach(updateEntity)
  })

  // Check for collisions
  layers[C_LAYER_ENEMIES].forEach(handleHeroEnemyCollision)

  layers[C_LAYER_HERO_PROJECTILES].forEach(handleHeroBulletCollidingIntoEnemy)

}

function handleHeroEnemyCollision(enemy) {
  if (!enemy || !colliding(enemy, playerEntity)) {
    return
  }

  // TODO: handle collision
  //console.log('enemy and hero colliding!')
  if (enemy.type === C_ENEMY_TYPE_MONKEY) {
    hurt(60)
  } else {
    hurt(30)
  }

}

function handleHeroBulletCollidingIntoEnemy(heroProjectile) {

  var foundAHit = false

  layers[C_LAYER_ENEMIES].forEach(function(enemy) {
    if (foundAHit || !enemy || !heroProjectile || !colliding(heroProjectile, enemy)) {
      return
    }
    enemy.d()
    heroProjectile.d()
    console.log('enemy hit')
    score += 50 + randInt(0,5)

    enemiesToDefeat--
    foundAHit = true
  })
}

// Let's draw pretty pictures
function draw() {
  layers.forEach(function(entity) {
    entity.forEach(drawEntitySprites)
  })
}

function loop() {
  requestAnimationFrame(loop)
  update()
  canvas.cls()
  draw()
  canvas.flush()
  frameCount++
}


// ---------------------------------------------------------
// Initialize "app"
// ---------------------------------------------------------

// Load the sprite sheet. Once it's loaded, that's how we know we are ready to rock!
spriteSheetImage.src    = 's.png'
spriteSheetImage.onload = function() {

  // When the image loads, create the sprite sheet texture
  spriteSheetTexture = CreateTexture(canvas.g, spriteSheetImage, spriteSheetImage.width, spriteSheetImage.height)

  // Set the canvas background
  canvas.bkg(0.133, 0.125, 0.204)

  createRain()

  // Create the menu screen
  createMenu()

  // Start loop
  loop()
}
