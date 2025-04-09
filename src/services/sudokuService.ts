import type { Cell, CellValue, Position } from '@/types/sudoku'
import { Difficulty } from '@/types/sudoku'

export class SudokuService {
  private static readonly GRID_SIZE = 9
  private static readonly BOX_SIZE = 3

  public static generatePuzzle(difficulty: Difficulty): Cell[][] {
    const solution = this.generateSolution()
    const puzzle = this.createPuzzle(solution, difficulty)
    return puzzle
  }

  private static generateSolution(): number[][] {
    const grid: number[][] = Array(this.GRID_SIZE)
      .fill(null)
      .map(() => Array(this.GRID_SIZE).fill(0))
    this.fillGrid(grid)
    return grid
  }

  private static fillGrid(grid: number[][]): boolean {
    const empty = this.findEmptyCell(grid)
    if (!empty) return true

    const [row, col] = empty
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])

    for (const num of numbers) {
      if (this.isValid(grid, row, col, num)) {
        grid[row][col] = num
        if (this.fillGrid(grid)) return true
        grid[row][col] = 0
      }
    }
    return false
  }

  private static findEmptyCell(grid: number[][]): Position | null {
    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        if (grid[i][j] === 0) return [i, j]
      }
    }
    return null
  }

  private static isValid(grid: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < this.GRID_SIZE; x++) {
      if (grid[row][x] === num) return false
    }

    // Check column
    for (let x = 0; x < this.GRID_SIZE; x++) {
      if (grid[x][col] === num) return false
    }

    // Check box
    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE
    for (let i = 0; i < this.BOX_SIZE; i++) {
      for (let j = 0; j < this.BOX_SIZE; j++) {
        if (grid[boxRow + i][boxCol + j] === num) return false
      }
    }

    return true
  }

  private static createPuzzle(solution: number[][], difficulty: Difficulty): Cell[][] {
    const puzzle = solution.map((row) =>
      row.map((value) => ({
        value: value || null,
        isEditable: true,
        isError: false,
        isHint: false,
        draftValues: [],
      })),
    )

    const cellsToRemove = this.getCellsToRemove(difficulty)
    const positions = this.shuffleArray(
      Array.from({ length: this.GRID_SIZE * this.GRID_SIZE }, (_, i) => [
        Math.floor(i / this.GRID_SIZE),
        i % this.GRID_SIZE,
      ]),
    )

    for (let i = 0; i < cellsToRemove; i++) {
      const [row, col] = positions[i]
      puzzle[row][col].value = null
      puzzle[row][col].isEditable = true
    }

    return puzzle
  }

  private static getCellsToRemove(difficulty: Difficulty): number {
    switch (difficulty) {
      case Difficulty.BEGINNER:
        return 41 + Math.floor(Math.random() * 5) // 36-40 cells visible
      case Difficulty.INTERMEDIATE:
        return 45 + Math.floor(Math.random() * 4) // 32-36 cells visible
      case Difficulty.HARD:
        return 49 + Math.floor(Math.random() * 4) // 28-32 cells visible
      case Difficulty.EXPERT:
        return 53 + Math.floor(Math.random() * 4) // 24-28 cells visible
      case Difficulty.ADVANCED:
        return 57 + Math.floor(Math.random() * 4) // 20-24 cells visible
      default:
        return 41 + Math.floor(Math.random() * 5) // Default to beginner
    }
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  public static validateCell(grid: Cell[][], row: number, col: number, value: CellValue): boolean {
    if (value === null) return true

    // Check row
    for (let x = 0; x < this.GRID_SIZE; x++) {
      if (x !== col && grid[row][x].value === value) return false
    }

    // Check column
    for (let x = 0; x < this.GRID_SIZE; x++) {
      if (x !== row && grid[x][col].value === value) return false
    }

    // Check box
    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE
    for (let i = 0; i < this.BOX_SIZE; i++) {
      for (let j = 0; j < this.BOX_SIZE; j++) {
        const currentRow = boxRow + i
        const currentCol = boxCol + j
        if (
          currentRow !== row &&
          currentCol !== col &&
          grid[currentRow][currentCol].value === value
        ) {
          return false
        }
      }
    }

    return true
  }

  public static isGridComplete(grid: Cell[][]): boolean {
    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        if (grid[i][j].value === null || grid[i][j].isError) return false
      }
    }
    return true
  }

  public static getAvailableNumbers(grid: Cell[][]): Record<number, boolean> {
    const available: Record<number, boolean> = {}
    for (let i = 1; i <= 9; i++) {
      available[i] = true
    }

    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        if (grid[i][j].value !== null) {
          available[grid[i][j].value as number] = false
        }
      }
    }

    return available
  }
}
