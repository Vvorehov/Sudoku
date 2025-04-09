<template>
  <div class="game">
    <div class="game-container">
      <div class="game-info">
        <div class="info-item">
          <span>Level: {{ capitalize(selectedDifficulty) }}</span>
        </div>
        <div class="info-item">
          <span>Score: {{ game.score }}</span>
        </div>
        <div class="info-item">
          <span>Time Spent: {{ formatTime(time) }}</span>
        </div>
        <div class="info-item">
          <button
            class="hint-button"
            :disabled="game.hintsRemaining <= 0"
            @click="handleHintRequest"
          >
            → Hint ({{ game.hintsRemaining }})
          </button>
        </div>
      </div>

      <div class="game-content">
        <div class="game-board-container">
          <SudokuGame ref="sudokuGameRef" />

          <div class="game-actions">
            <button class="action-button" @click="startNewGame">New Game</button>
            <button
              class="action-button clear-button"
              @click="handleClearCell"
              :disabled="!hasSelectedCell"
            >
              Clear Cell
            </button>
            <button class="action-button check-button" @click="checkSolution">
              Check Solution
            </button>
          </div>
        </div>

        <div class="leaderboard">
          <div class="leaderboard-header">
            <h3>Leaderboard</h3>
          </div>
          <div class="difficulty-section">
            <h4>EASY:</h4>
            <ol>
              <li
                v-for="(record, index) in getRecordsByDifficulty(Difficulty.BEGINNER)"
                :key="`easy-${index}`"
                :class="{ 'current-user': record.isCurrentUser }"
              >
                {{ record.score }} - {{ record.name || 'Anonymous' }}
              </li>
              <li
                v-if="getRecordsByDifficulty(Difficulty.BEGINNER).length === 0"
                class="no-records"
              >
                No records yet
              </li>
            </ol>
          </div>
          <div class="difficulty-section">
            <h4>MEDIUM:</h4>
            <ol>
              <li
                v-for="(record, index) in getRecordsByDifficulty(Difficulty.INTERMEDIATE)"
                :key="`medium-${index}`"
                :class="{ 'current-user': record.isCurrentUser }"
              >
                {{ record.score }} - {{ record.name || 'Anonymous' }}
              </li>
              <li
                v-if="getRecordsByDifficulty(Difficulty.INTERMEDIATE).length === 0"
                class="no-records"
              >
                No records yet
              </li>
            </ol>
          </div>
          <div class="difficulty-section">
            <h4>HARD:</h4>
            <ol>
              <li
                v-for="(record, index) in getRecordsByDifficulty(Difficulty.ADVANCED)"
                :key="`hard-${index}`"
                :class="{ 'current-user': record.isCurrentUser }"
              >
                {{ record.score }} - {{ record.name || 'Anonymous' }}
              </li>
              <li
                v-if="getRecordsByDifficulty(Difficulty.ADVANCED).length === 0"
                class="no-records"
              >
                No records yet
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div class="difficulty-selector">
        <select v-model="selectedDifficulty" class="difficulty-select" @change="startNewGame">
          <option v-for="diff in difficulties" :key="diff" :value="diff">
            {{ capitalize(diff) }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="showMessage" :class="['alert', messageType]">
      {{ message }}
      <button
        v-if="messageType === 'alert-danger'"
        class="close-button"
        @click="showMessage = false"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import SudokuGame from '@/components/SudokuGame.vue'
import { Difficulty } from '@/types/sudoku'

const game = useGameStore()
const selectedDifficulty = ref<Difficulty>(Difficulty.BEGINNER)
const time = ref(0)
const showMessage = ref(false)
const message = ref('')
const messageType = ref<'alert-success' | 'alert-danger' | 'alert-warning'>('alert-success')
const timer = ref<number | null>(null)
const sudokuGameRef = ref<InstanceType<typeof SudokuGame> | null>(null)

const difficulties = Object.values(Difficulty)

const hasSelectedCell = computed(() => {
  return game.selectedCell !== null
})

const startNewGame = () => {
  game.startNewGame(selectedDifficulty.value)
  time.value = 0
  showMessage.value = false
  startTimer()

  // Reset any UI state in the SudokuGame component
  if (sudokuGameRef.value) {
    sudokuGameRef.value.hintCells.clear()
  }
}

const startTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  timer.value = window.setInterval(() => {
    time.value++
  }, 1000)
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const handleHintRequest = () => {
  if (game.hintsRemaining <= 0) return

  // Call the handleHintClick method in the SudokuGame component
  if (sudokuGameRef.value && sudokuGameRef.value.handleHintClick) {
    sudokuGameRef.value.handleHintClick()

    showMessage.value = true
    message.value = 'Hint applied! -50 points'
    messageType.value = 'alert-warning'

    // Auto-hide the message after 3 seconds
    setTimeout(() => {
      if (messageType.value === 'alert-warning') {
        showMessage.value = false
      }
    }, 3000)
  }
}

const handleClearCell = () => {
  game.clearSelectedCell()
}

const checkSolution = () => {
  // Check for errors first
  let hasErrors = false
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (game.grid[row][col].value && sudokuGameRef.value?.isErrorCell(row, col)) {
        hasErrors = true
        break
      }
    }
    if (hasErrors) break
  }

  if (hasErrors) {
    showMessage.value = true
    message.value = 'There are errors in your solution. Red cells contain mistakes.'
    messageType.value = 'alert-danger'
    return
  }

  const isComplete = game.checkSolution()
  if (isComplete) {
    stopTimer()
    showMessage.value = true
    message.value = 'Congratulations! You solved the puzzle correctly!'
    messageType.value = 'alert-success'
  } else {
    showMessage.value = true
    message.value = 'The puzzle is not complete yet. Keep going!'
    messageType.value = 'alert-warning'

    // Auto-hide the message after 3 seconds
    setTimeout(() => {
      if (messageType.value === 'alert-warning') {
        showMessage.value = false
      }
    }, 3000)
  }
}

const getRecordsByDifficulty = (difficulty: Difficulty) => {
  return game.records
    .filter((record) => record.difficulty === difficulty)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

onMounted(() => {
  startNewGame()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.game {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.game-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: white;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.info-item {
  font-size: 0.9rem;
  font-weight: 500;
}

.hint-button {
  background: none;
  border: none;
  color: #4285f4;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0;
}

.hint-button:disabled {
  color: #888;
  cursor: not-allowed;
}

.game-content {
  display: flex;
  gap: 2rem;
}

.game-board-container {
  flex: 1;
  max-width: 500px;
}

.game-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.action-button {
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
}

.action-button:hover {
  background-color: #3367d6;
}

.action-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.clear-button {
  background-color: #fbbc05;
}

.clear-button:hover {
  background-color: #f09900;
}

.check-button {
  background-color: #34a853;
}

.check-button:hover {
  background-color: #2e8b57;
}

.leaderboard {
  min-width: 200px;
  background-color: white;
  border-radius: 4px;
  padding: 1rem;
}

.leaderboard-header {
  margin-bottom: 1rem;
  text-align: center;
}

.leaderboard-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.difficulty-section {
  margin-bottom: 1rem;
}

.difficulty-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #555;
}

.difficulty-section ol {
  margin: 0;
  padding-left: 1.5rem;
}

.difficulty-section li {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.no-records {
  font-style: italic;
  color: #888;
  list-style: none;
  margin-left: -1rem;
}

.current-user {
  font-weight: 700;
}

.difficulty-selector {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.difficulty-select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 150px;
  font-size: 0.9rem;
  background-color: white;
}

.alert {
  position: relative;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
}

.close-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
}

.close-button:hover {
  opacity: 1;
}

.alert-success {
  background-color: #d5f5e3;
  border: 1px solid #2ecc71;
  color: #27ae60;
}

.alert-danger {
  background-color: #fadbd8;
  border: 1px solid #e74c3c;
  color: #c0392b;
}

.alert-warning {
  background-color: #fef9e7;
  border: 1px solid #f1c40f;
  color: #f39c12;
}

@media (max-width: 768px) {
  .game-content {
    flex-direction: column;
  }

  .game-board-container {
    max-width: 100%;
  }

  .leaderboard {
    width: 100%;
  }

  .game-info {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .info-item {
    flex: 1 0 45%;
  }
}
</style>
