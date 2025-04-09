<template>
  <div class="sudoku-game">
    <div class="game-board">
      <div v-for="(row, rowIndex) in game.grid" :key="rowIndex" class="board-row">
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          :class="[
            'board-cell',
            {
              'cell-initial': !cell.isEditable,
              'cell-selected':
                game.selectedCell?.[0] === rowIndex && game.selectedCell?.[1] === colIndex,
              'cell-highlighted': isCellHighlighted(rowIndex, colIndex),
              'cell-error': isErrorCell(rowIndex, colIndex),
              'cell-hint': isHintCell(rowIndex, colIndex),
            },
          ]"
          @click="handleCellClick(rowIndex, colIndex)"
        >
          {{ cell.value || '' }}
        </div>
      </div>
    </div>

    <div class="available-digits">
      <div class="digits-label">Available Digits:</div>
      <div class="number-pad">
        <button
          v-for="num in 9"
          :key="num"
          class="number-button"
          :class="{ 'button-disabled': !game.availableNumbers[num] }"
          @click="handleNumberClick(num)"
        >
          {{ num }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { Difficulty } from '@/types/sudoku'

defineOptions({
  name: 'SudokuGame',
})

const game = useGameStore()
const hintCells = ref<Set<string>>(new Set())

// Expose the hintCells ref and methods to the parent component
defineExpose({
  hintCells,
  handleHintClick,
  isErrorCell,
})

const formatTime = computed(() => {
  if (game.isPaused || game.isComplete) return '00:00'
  const elapsed = Math.floor((Date.now() - game.startTime) / 1000)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

let timer: number

onMounted(() => {
  game.loadRecords()
  game.startNewGame(Difficulty.BEGINNER)
  timer = window.setInterval(() => {
    if (!game.isPaused && !game.isComplete) {
      // Force update for timer
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

function startNewGame(difficulty: Difficulty) {
  game.startNewGame(difficulty)
  hintCells.value.clear()
}

function handleCellClick(row: number, col: number) {
  game.setSelectedCell(row, col)
}

function handleNumberClick(value: number) {
  if (game.selectedCell) {
    const [row, col] = game.selectedCell
    game.updateCell(row, col, value)
  }
}

function handleHintClick() {
  const hint = game.getHint()
  if (hint) {
    game.setSelectedCell(hint.row, hint.col)
    // Mark this cell as a hint
    hintCells.value.add(`${hint.row}-${hint.col}`)
    // Apply the hint value
    game.updateCell(hint.row, hint.col, hint.value)
    return true
  }
  return false
}

function handleClearCell() {
  if (game.selectedCell) {
    const [row, col] = game.selectedCell
    game.updateCell(row, col, 0)
  }
}

function isCellHighlighted(row: number, col: number): boolean {
  if (!game.selectedCell) return false
  const [selectedRow, selectedCol] = game.selectedCell
  return (
    row === selectedRow ||
    col === selectedCol ||
    (Math.floor(row / 3) === Math.floor(selectedRow / 3) &&
      Math.floor(col / 3) === Math.floor(selectedCol / 3))
  )
}

function isErrorCell(row: number, col: number): boolean {
  const cell = game.grid[row][col]
  if (!cell.value) return false

  // Check row
  for (let i = 0; i < 9; i++) {
    if (i !== col && game.grid[row][i].value === cell.value) return true
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== row && game.grid[i][col].value === cell.value) return true
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (i !== row && j !== col && game.grid[i][j].value === cell.value) return true
    }
  }

  return false
}

function isHintCell(row: number, col: number): boolean {
  return hintCells.value.has(`${row}-${col}`)
}

function formatTimeSpent(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}
</script>

<script lang="ts">
export default {}
</script>

<style scoped>
.sudoku-game {
  max-width: 500px;
  margin: 0 auto;
}

/* Special border styling for the 3x3 segments */
.game-board {
  display: grid;
  grid-template-rows: repeat(9, 1fr);
  background-color: #888;
  margin-bottom: 1.5rem;
  border: 1px solid #888;
}

.board-row {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
}

/* Add thicker borders for the 3x3 segments */
.board-cell {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  border: 1px solid #bbb;
  position: relative;
}

/* Create thicker borders for 3x3 boxes */
.board-cell:nth-child(3n) {
  border-right: 2px solid #888;
}

.board-cell:nth-child(9) {
  border-right: 1px solid #888;
}

.board-row:nth-child(3n) .board-cell {
  border-bottom: 2px solid #888;
}

.board-row:nth-child(9) .board-cell {
  border-bottom: 1px solid #888;
}

.cell-initial {
  background-color: #e8e8e8;
  font-weight: 700;
  color: #333;
}

.cell-selected {
  background-color: #ffeb3b;
}

.cell-highlighted {
  background-color: #f5f5f5;
}

.cell-error {
  color: white;
  background-color: #e74c3c;
}

.cell-hint {
  color: #4285f4;
  font-weight: 700;
}

.available-digits {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.digits-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-align: center;
}

.number-pad {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.number-button {
  width: 40px;
  height: 40px;
  border: none;
  background-color: #4285f4;
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.number-button:hover:not(.button-disabled) {
  background-color: #3367d6;
}

.button-disabled {
  background-color: #e8e8e8;
  color: #888;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .board-cell,
  .number-button {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .board-cell,
  .number-button {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
}
</style>
