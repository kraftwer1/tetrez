import "hammerjs"
import { config } from "./config"
import { initView, isFrontSideBack, paint, rotateView } from "./view"
import { play } from "./audio"
import { Queue } from "./Queue"
import { Tetromino } from "./Tetromino"
import {
  initField,
  applyTetromino,
  canPlaceTetromino,
  canTetrominoMoveLeft,
  canTetrominoMoveRight,
  canTetrominoMoveDown,
  canTetrominoRotate,
  registerOnRowComplete,
  registerOnRowsComplete,
} from "./field"

let score: number
let counter: number
let isGameOver: boolean
let currentSpeed: number
let currentTetromino: Tetromino | undefined

let isBassPlaying: boolean
let isHiHatPlaying: boolean

let isDownKeyRepeating: boolean
let interrupted: boolean

let mainSequencerCounter: number
let bassSequencerCounter: number
let quarterTickQueue: Queue<Function>
let lastEighthTickTime: DOMHighResTimeStamp
let lastQuarterTickTime: DOMHighResTimeStamp

function runLoop(time: DOMHighResTimeStamp) {
  // Eighth tick (for moving down fast while button is pressed)
  if (!lastEighthTickTime || time - lastEighthTickTime >= currentSpeed / 8) {
    if (isDownKeyRepeating && !interrupted) {
      moveDown()
    }

    lastEighthTickTime = time
  }

  // Quarter tick
  if (!lastQuarterTickTime || time - lastQuarterTickTime >= currentSpeed / 4) {
    runMainSequencer()
    runBassSequencer()

    if (isDownKeyRepeating && !interrupted) {
      play("halfbd.mp3")
    }

    if (mainSequencerCounter === 1) {
      if (!(isDownKeyRepeating && !interrupted)) moveDown()
    }

    if (mainSequencerCounter === 4) {
      mainSequencerCounter = 1
    } else {
      mainSequencerCounter++
    }

    if (bassSequencerCounter === 64) {
      bassSequencerCounter = 1
    } else {
      bassSequencerCounter++
    }

    lastQuarterTickTime = time
  }

  if (!isGameOver) requestAnimationFrame(runLoop)
}

function runMainSequencer() {
  while (quarterTickQueue.getLength()) {
    quarterTickQueue.getCurrent()()
    quarterTickQueue.pop()
  }

  switch (mainSequencerCounter) {
    case 1:
      play("bd.mp3")

      break

    case 2:
      break

    case 3:
      if (isHiHatPlaying) play("hh.mp3")
      break

    case 4:
      break
  }
}

function runBassSequencer() {
  if (!isBassPlaying) return

  switch (bassSequencerCounter) {
    case 2:
      play("bass2.mp3")
      break

    case 4:
      play("bass3.mp3")
      break

    case 6:
      play("bass3.mp3")
      break

    case 20:
      play("bass3.mp3")
      break

    case 22:
      play("bass3.mp3")
      break

    case 34:
      play("bass2.mp3")
      break

    case 36:
      play("bass3.mp3")
      break

    case 38:
      play("bass3.mp3")
      break

    case 52:
      play("bass3.mp3")
      break

    case 54:
      play("bass3.mp3")
      break

    case 58:
      play("bass1.mp3")
      break

    case 59:
      play("bass4.mp3")
      break

    case 61:
      play("bass4.mp3")
      break

    case 64:
      play("bass1.mp3")
      break
  }
}

function moveLeft() {
  if (!(currentTetromino && canTetrominoMoveLeft(currentTetromino))) {
    return
  }

  quarterTickQueue.push(() => play("wood.mp3"))
  currentTetromino.moveLeft()
  applyTetromino(currentTetromino, 1)
  paint()
}

function moveRight() {
  if (!(currentTetromino && canTetrominoMoveRight(currentTetromino))) {
    return
  }

  quarterTickQueue.push(() => play("wood.mp3"))
  currentTetromino.moveRight()
  applyTetromino(currentTetromino, 1)
  paint()
}

function moveDown() {
  if (!currentTetromino) {
    currentTetromino = new Tetromino()

    if (canPlaceTetromino(currentTetromino)) {
      applyTetromino(currentTetromino, 1)
    } else {
      isGameOver = true
    }
  } else {
    if (canTetrominoMoveDown(currentTetromino)) {
      currentTetromino.moveDown()
      applyTetromino(currentTetromino, 1)
    } else {
      // Cannot move any further, "apply" tetromino into field permanently
      applyTetromino(currentTetromino, 2)

      quarterTickQueue.push(() => play("chord.mp3"))

      // Ignore further repeated keypress after tetromino has "landed"
      interrupted = true

      // Bugfix for Hammer.js / touch event,
      // force release, sometimes hangs...
      isDownKeyRepeating = false

      // Tetromino isn't current anymore ;-)
      currentTetromino = undefined
    }
  }

  // Quit on game over
  if (isGameOver) {
    document.getElementById("score")!.innerHTML = "Score: " + score * 10
    document.getElementById("score")!.style.visibility = "visible"
    document.getElementById("gameOver")!.style.display = "block"
    document.getElementById("screen")!.style.display = "flex"

    // This setTimeout() is required to play the animation
    setTimeout(() => {
      document.getElementById("screen")!.classList.remove("transparent")
    }, 200)
  }

  paint()
}

function rotate() {
  if (!currentTetromino) return

  const rotatedMatrix = canTetrominoRotate(currentTetromino)

  if (!rotatedMatrix) return

  quarterTickQueue.push(() => play("sweep.mp3"))
  currentTetromino.rotate(rotatedMatrix)
  applyTetromino(currentTetromino, 1)
  paint()
}

function accelerate() {
  currentSpeed = currentSpeed - 100
}

function onRowComplete() {
  score++
  counter++

  if (counter % 4 === 0) play("sunrise.mp3")

  switch (counter) {
    case 4:
      isBassPlaying = true
      rotateView({ x: Math.PI / 8 })
      break

    case 8:
      isHiHatPlaying = true
      rotateView({ y: Math.PI / 8 })
      break

    case 12:
      rotateView({ x: Math.PI / 8 })
      break

    case 16:
      rotateView({ y: Math.PI / 8 })
      break

    case 20:
      rotateView({ y: Math.PI / 2 })
      break

    case 24:
      rotateView({ y: Math.PI / 8 })
      break

    case 28:
      rotateView({ x: -Math.PI / 8 })
      break

    case 32:
      rotateView({ y: Math.PI / 8 })
      break

    case 36:
      rotateView({ x: -Math.PI / 8 })

      // Reset
      counter = 0

      // Game gets faster!
      accelerate()
      break
  }
}

export function onRowsComplete(rows: number) {
  score += rows
  quarterTickQueue.push(() => play("trance.mp3"))
}

export function initController() {
  score = 0
  counter = 0
  isGameOver = false
  currentSpeed = config.initialSpeed

  isBassPlaying = false
  isHiHatPlaying = false

  isDownKeyRepeating = false
  interrupted = false

  bassSequencerCounter = 1
  mainSequencerCounter = 1

  quarterTickQueue = new Queue()

  const hammer = new Hammer(document.getElementById("canvas")!)

  registerOnRowComplete(onRowComplete)
  registerOnRowsComplete(onRowsComplete)

  addEventListener("keydown", (e) => {
    if (isGameOver) return

    switch (e.key) {
      case "ArrowLeft":
        // Flip left and right between 90° - and 270° to confuse the user less
        isFrontSideBack() ? moveRight() : moveLeft()
        break

      case "ArrowRight":
        // Flip left and right between 90° - and 270° to confuse the user less
        isFrontSideBack() ? moveLeft() : moveRight()
        break

      case "ArrowUp":
        rotate()
        break

      case "ArrowDown":
        isDownKeyRepeating = true
        break
    }
  })

  addEventListener("keyup", (e) => {
    if (isGameOver) return

    switch (e.key) {
      case "ArrowDown":
        isDownKeyRepeating = false
        interrupted = false
        break
    }
  })

  hammer.on("swipe", (e) => {
    switch (e.direction) {
      case 2: // Left
        isFrontSideBack() ? moveRight() : moveLeft()
        break

      case 4: // Right
        isFrontSideBack() ? moveLeft() : moveRight()
        break
    }
  })

  hammer.on("tap", () => {
    rotate()
  })

  hammer.on("press", () => {
    isDownKeyRepeating = true
  })

  hammer.on("pressup", () => {
    isDownKeyRepeating = false
    interrupted = false
  })

  // Intro sound
  play("sunrise.mp3")

  initView()
  initField()

  // Run game loop
  requestAnimationFrame(runLoop)
}
