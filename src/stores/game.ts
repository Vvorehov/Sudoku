import { defineStore } from 'pinia'
import type { Cell, GameRecord, Position } from '@/types/sudoku'
import { Difficulty } from '@/types/sudoku'
import { SudokuService } from '@/services/sudokuService'

interface GameState {
  grid: Cell[][]
  solution: number[][]
  initialGrid: Cell[][]
  difficulty: Difficulty
  score: number
  hintsRemaining: number
  startTime: number
  endTime: number | null
  isComplete: boolean
  isPaused: boolean
  availableNumbers: Record<number, boolean>
  history: Cell[][][]
  historyIndex: number
  records: GameRecord[]
  selectedCell: Position | null
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    grid: [],
    solution: [],
    initialGrid: [],
    difficulty: Difficulty.BEGINNER,
    score: 0,
    hintsRemaining: 3,
    startTime: 0,
    endTime: null,
    isComplete: false,
    isPaused: false,
    availableNumbers: {},
    history: [],
    historyIndex: -1,
    records: [],
    selectedCell: null,
  }),

  actions: {
    generatePuzzle(difficulty: Difficulty) {
      const puzzle = SudokuService.generatePuzzle(difficulty)
      this.grid = puzzle
      this.initialGrid = JSON.parse(JSON.stringify(puzzle))
      this.difficulty = difficulty
      this.score = 1000
      this.hintsRemaining = 3
      this.startTime = Date.now()
      this.endTime = null
      this.isComplete = false
      this.isPaused = false
      this.availableNumbers = SudokuService.getAvailableNumbers(this.grid)
      this.history = [JSON.parse(JSON.stringify(this.grid))]
      this.historyIndex = 0
      this.selectedCell = null
      return puzzle
    },

    updateCell(row: number, col: number, value: number) {
      if (!this.initialGrid[row][col].isEditable) return

      this.grid[row][col].value = value
      this.availableNumbers = SudokuService.getAvailableNumbers(this.grid)
      this.isComplete = SudokuService.isGridComplete(this.grid)

      if (this.isComplete) {
        this.endTime = Date.now()
        this.saveScore()
      }

      this.saveToHistory()
    },

    getHint() {
      if (this.hintsRemaining <= 0) return null

      const emptyCells = this.grid
        .flatMap((row, i) => row.map((cell, j) => ({ row: i, col: j, cell })))
        .filter(({ cell }) => cell.value === null)

      if (emptyCells.length === 0) return null

      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      this.hintsRemaining--
      this.score -= 50

      return {
        row: randomCell.row,
        col: randomCell.col,
        value: this.solution[randomCell.row][randomCell.col],
      }
    },

    checkSolution() {
      return SudokuService.isGridComplete(this.grid)
    },

    saveToHistory() {
      this.history = this.history.slice(0, this.historyIndex + 1)
      this.history.push(JSON.parse(JSON.stringify(this.grid)))
      this.historyIndex++
    },

    saveScore() {
      const timeSpent = Math.floor((this.endTime! - this.startTime) / 1000)
      const finalScore = this.score - timeSpent
      const newRecord: GameRecord = {
        difficulty: this.difficulty,
        score: finalScore,
        date: new Date().toISOString(),
        timeSpent,
      }

      const records = this.getScores(this.difficulty)
      records.push(newRecord)
      records.sort((a, b) => b.score - a.score)
      records.splice(10) // Keep only top 10 scores

      localStorage.setItem(`sudokuRecords_${this.difficulty}`, JSON.stringify(records))
    },

    getScores(difficulty: Difficulty): GameRecord[] {
      const savedRecords = localStorage.getItem(`sudokuRecords_${difficulty}`)
      return savedRecords ? JSON.parse(savedRecords) : []
    },

    loadRecords() {
      this.records = Object.values(Difficulty).flatMap((difficulty) => this.getScores(difficulty))
    },

    startNewGame(difficulty: Difficulty) {
      this.generatePuzzle(difficulty)
    },

    setSelectedCell(row: number, col: number) {
      if (this.grid[row][col].isEditable) {
        this.selectedCell = [row, col]
      }
    },

    clearSelectedCell() {
      if (this.selectedCell) {
        const [row, col] = this.selectedCell
        this.updateCell(row, col, 0)
      }
    },
  },
})
