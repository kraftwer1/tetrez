export type Shape = {
  matrix: Matrix[]
  pivot: number
  rotations: number[]
  color: number
}

export type Matrix = {
  vector: Vector
  visible: boolean
}

// A block is a part of the field
type Block = {
  // 0 = not occupied at all
  // 1 = temporarily occupied (by the current tetromino)
  // 2 = permanently occupied (by previous tetrominos)
  occupation: 0 | 1 | 2
  color: number
}

type Vector = [number, number]
