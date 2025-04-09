import { describe, it, expect } from 'vitest'
import { SudokuService } from '../sudokuService'
import type { Cell } from '@/types/sudoku'
import { Difficulty } from '@/types/sudoku'

describe('SudokuService', () => {
  describe('generatePuzzle', () => {
    it('should generate a valid puzzle with correct number of cells', () => {
      const puzzle = SudokuService.generatePuzzle(Difficulty.BEGINNER)

      // Check grid size
      expect(puzzle.length).toBe(9)
      expect(puzzle[0].length).toBe(9)

      // Count visible cells (should be between 36-40 for beginner)
      const visibleCells = puzzle.flat().filter((cell) => cell.value !== null).length
      expect(visibleCells).toBeGreaterThanOrEqual(36)
      expect(visibleCells).toBeLessThanOrEqual(40)

      // Check that non-editable cells have values
      puzzle.forEach((row) => {
        row.forEach((cell) => {
          if (!cell.isEditable) {
            expect(cell.value).not.toBeNull()
          }
        })
      })
    })
  })

  describe('validateCell', () => {
    it('should validate cells correctly', () => {
      const grid: Cell[][] = Array(9)
        .fill(null)
        .map(() =>
          Array(9)
            .fill(null)
            .map(() => ({
              value: null,
              isEditable: true,
              isError: false,
              isHint: false,
              draftValues: [],
            })),
        )

      // Test valid placement
      expect(SudokuService.validateCell(grid, 0, 0, 1)).toBe(true)
      grid[0][0].value = 1

      // Test invalid placement in same row
      expect(SudokuService.validateCell(grid, 0, 1, 1)).toBe(false)

      // Test invalid placement in same column
      expect(SudokuService.validateCell(grid, 1, 0, 1)).toBe(false)

      // Test invalid placement in same box
      expect(SudokuService.validateCell(grid, 1, 1, 1)).toBe(false)

      // Test valid placement in different box
      expect(SudokuService.validateCell(grid, 1, 1, 2)).toBe(true)
    })
  })

  describe('isGridComplete', () => {
    it('should correctly identify complete and incomplete grids', () => {
      const completeGrid: Cell[][] = Array(9)
        .fill(null)
        .map(() =>
          Array(9)
            .fill(null)
            .map(() => ({
              value: 1,
              isEditable: true,
              isError: false,
              isHint: false,
              draftValues: [],
            })),
        )

      const incompleteGrid: Cell[][] = Array(9)
        .fill(null)
        .map(() =>
          Array(9)
            .fill(null)
            .map(() => ({
              value: null,
              isEditable: true,
              isError: false,
              isHint: false,
              draftValues: [],
            })),
        )

      expect(SudokuService.isGridComplete(completeGrid)).toBe(true)
      expect(SudokuService.isGridComplete(incompleteGrid)).toBe(false)
    })
  })

  describe('getAvailableNumbers', () => {
    it('should correctly identify available numbers', () => {
      const grid: Cell[][] = Array(9)
        .fill(null)
        .map(() =>
          Array(9)
            .fill(null)
            .map(() => ({
              value: null,
              isEditable: true,
              isError: false,
              isHint: false,
              draftValues: [],
            })),
        )

      // Fill first row with numbers 1-9
      for (let i = 0; i < 9; i++) {
        grid[0][i].value = i + 1
      }

      const available = SudokuService.getAvailableNumbers(grid)

      // All numbers should be unavailable in first row
      for (let i = 1; i <= 9; i++) {
        expect(available[i]).toBe(false)
      }
    })
  })
})
