import { config } from "./config"
import { Shape, Vector } from "./types"

const tetrominoNames = [
  "t",
  "s",
  "sInverted",
  "l",
  "lInverted",
  "i",
  "o",
] as const

function createEmptyShape(name: typeof tetrominoNames[number]): Shape {
  switch (name) {
    case "t":
      return {
        matrix: [
          { vector: [0, 0], visible: true },
          { vector: [0, 1], visible: true },
          { vector: [0, 2], visible: true },
          { vector: [1, 0], visible: false },
          { vector: [1, 1], visible: true },
          { vector: [1, 2], visible: false },
        ],
        pivot: 1,
        rotations: [Math.PI / 2],
        color: 0xfde6d0,
      }

    case "s":
      return {
        matrix: [
          { vector: [0, 0], visible: true },
          { vector: [0, 1], visible: true },
          { vector: [0, 2], visible: false },
          { vector: [1, 0], visible: false },
          { vector: [1, 1], visible: true },
          { vector: [1, 2], visible: true },
        ],
        pivot: 4,
        rotations: [Math.PI / 2, Math.PI * 1.5],
        color: 0xfddbb3,
      }

    case "sInverted":
      return {
        matrix: [
          { vector: [0, 0], visible: false },
          { vector: [0, 1], visible: true },
          { vector: [0, 2], visible: true },
          { vector: [1, 0], visible: true },
          { vector: [1, 1], visible: true },
          { vector: [1, 2], visible: false },
        ],
        pivot: 4,
        rotations: [Math.PI / 2, Math.PI * 1.5],
        color: 0xeba69d,
      }

    case "l":
      return {
        matrix: [
          { vector: [0, 0], visible: false },
          { vector: [0, 1], visible: false },
          { vector: [0, 2], visible: true },
          { vector: [1, 0], visible: true },
          { vector: [1, 1], visible: true },
          { vector: [1, 2], visible: true },
        ],
        pivot: 4,
        rotations: [Math.PI / 2],
        color: 0xc7676f,
      }

    case "lInverted":
      return {
        matrix: [
          { vector: [0, 0], visible: true },
          { vector: [0, 1], visible: false },
          { vector: [0, 2], visible: false },
          { vector: [1, 0], visible: true },
          { vector: [1, 1], visible: true },
          { vector: [1, 2], visible: true },
        ],
        pivot: 4,
        rotations: [Math.PI / 2],
        color: 0x8f3b50,
      }

    case "i":
      return {
        matrix: [
          { vector: [0, 0], visible: true },
          { vector: [0, 1], visible: true },
          { vector: [0, 2], visible: true },
          { vector: [0, 3], visible: true },
        ],
        pivot: 1,
        rotations: [Math.PI * 1.5, Math.PI / 2],
        color: 0x441833,
      }

    case "o":
      return {
        matrix: [
          { vector: [0, 0], visible: true },
          { vector: [0, 1], visible: true },
          { vector: [1, 0], visible: true },
          { vector: [1, 1], visible: true },
        ],
        pivot: 0,
        rotations: [],
        color: 0xffffff,
      }
  }
}

export class Tetromino {
  public shape: Shape
  public currentRotationPointer = 0

  constructor() {
    // Create random tetromino
    let randomTetrominoName: typeof tetrominoNames[number] =
      tetrominoNames[Math.floor(Math.random() * tetrominoNames.length)]

    if (config.onlyTTetrominos) randomTetrominoName = "i"

    this.shape = createEmptyShape(randomTetrominoName)

    // Place tetromino horizontally centered
    for (const matrix of this.shape.matrix) {
      matrix.vector[1] =
        matrix.vector[1] + Math.floor(config.dimension.x / 2) - 1
    }
  }

  public moveLeft() {
    for (const matrix of this.shape.matrix) {
      matrix.vector[1]--
    }
  }

  public moveRight() {
    for (const matrix of this.shape.matrix) {
      matrix.vector[1]++
    }
  }

  public moveDown() {
    // Increment y coordinates
    for (const matrix of this.shape.matrix) {
      matrix.vector[0]++
    }
  }

  public rotate(to: Vector[]) {
    // Apply rotated coordinates
    for (const [i, matrix] of this.shape.matrix.entries()) {
      matrix.vector = to[i]
    }

    if (this.currentRotationPointer === this.shape.rotations.length - 1) {
      this.currentRotationPointer = 0
    } else {
      this.currentRotationPointer++
    }
  }

  public forEachVisibleBlock(cb: (x: number, y: number) => boolean) {
    for (const matrix of this.shape.matrix) {
      if (!matrix.visible) continue

      if (cb(matrix.vector[1], matrix.vector[0]) === false) break
    }
  }
}
