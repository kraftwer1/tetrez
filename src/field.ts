import "sylvester"
import { config } from "./config"
import { Tetromino } from "./Tetromino"
import { Block, Vector } from "./types"

let field: Block[][]

let onRowComplete: () => void
let onRowsComplete: (rows: number) => void

function createEmptyBlock(): Block {
  return {
    occupation: 0,
    color: 0x000000,
  }
}

export function registerOnRowComplete(cb: () => void) {
  onRowComplete = cb
}

export function registerOnRowsComplete(cb: (rows: number) => void) {
  onRowsComplete = cb
}

export function canPlaceTetromino(tetromino: Tetromino): boolean {
  let isPossible = true

  // Check for every visible block if placing is possible
  tetromino.forEachVisibleBlock((x, y) => {
    if (field[y][x].occupation === 2) {
      isPossible = false
      return false
    }

    return true
  })

  return isPossible
}

export function canTetrominoMoveLeft(tetromino: Tetromino): boolean {
  let isPossible = true

  tetromino.forEachVisibleBlock((x, y) => {
    if (!field[y][x - 1] || field[y][x - 1].occupation === 2) {
      isPossible = false
      return false
    }

    return true
  })

  return isPossible
}

export function canTetrominoMoveRight(tetromino: Tetromino): boolean {
  let isPossible = true

  tetromino.forEachVisibleBlock((x, y) => {
    if (!field[y][x + 1] || field[y][x + 1].occupation === 2) {
      isPossible = false
      return false
    }

    return true
  })

  return isPossible
}

export function canTetrominoMoveDown(tetromino: Tetromino): boolean {
  let isPossible = true

  // Check for every visible block if moving down is possible
  tetromino.forEachVisibleBlock((x, y) => {
    if (!field[y + 1] || field[y + 1][x].occupation === 2) {
      isPossible = false
      return false
    }

    return true
  })

  return isPossible
}

export function canTetrominoRotate(tetromino: Tetromino): Vector[] | undefined {
  let isPossible = true

  const pivot = $V(tetromino.shape.matrix[tetromino.shape.pivot].vector)
  const rotatedVectors: Vector[] = []

  for (const matrix of tetromino.shape.matrix) {
    const rotatedVector = $V(matrix.vector)
      .rotate(
        tetromino.shape.rotations[tetromino.currentRotationPointer],
        pivot
      )
      .round()

    const [y, x] = rotatedVector.elements

    // Cache rotated block for later use (e.g. if the whole rotation was
    // successful)
    rotatedVectors.push([y, x])

    // Break if surrounding blocks are occupied or the end of the field has
    // been reached
    if (!field[y] || !field[y][x] || field[y][x].occupation === 2) {
      isPossible = false
      break
    }
  }

  if (isPossible) return rotatedVectors

  return
}

export function applyTetromino(tetromino: Tetromino, occupation: 0 | 1 | 2) {
  let completedRowsAtOnce = 0

  // Clear all temporary occupations
  for (const row of field) {
    for (const block of row) {
      if (block.occupation === 1) block.occupation = 0
    }
  }

  tetromino.forEachVisibleBlock((x, y) => {
    field[y][x] = { occupation, color: tetromino.shape.color }
    return true
  })

  // Complete row detection
  for (let i = 0; i < field.length; ++i) {
    for (let j = 0; j < field[i].length; ++j) {
      if (field[i][j].occupation !== 2) break

      // Row is complete
      if (j === field[i].length - 1) {
        const newRow: Block[] = []

        for (let k = 0; k < config.dimension.x; ++k) {
          newRow.push(createEmptyBlock())
        }

        field.splice(i, 1)
        field.unshift(newRow)

        completedRowsAtOnce++
        onRowComplete()
      }
    }
  }

  if (completedRowsAtOnce) onRowsComplete(completedRowsAtOnce)
}

export function forEachBlock(
  cb: (block: Block, rowIndex: number, blockIndex: number) => void
) {
  for (const [i, row] of field.entries()) {
    for (const [j, block] of row.entries()) {
      cb(block, i, j)
    }
  }
}

export function initField() {
  field = []

  for (let i = 0; i < config.dimension.y; i++) {
    field[i] = []

    for (let j = 0; j < config.dimension.x; j++) {
      field[i][j] = createEmptyBlock()
    }
  }
}
