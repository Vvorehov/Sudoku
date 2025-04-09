<template>
  <div class="records">
    <h1>High Scores</h1>

    <div class="difficulty-tabs">
      <button
        v-for="difficulty in difficulties"
        :key="difficulty"
        :class="['tab-button', { active: selectedDifficulty === difficulty }]"
        @click="selectedDifficulty = difficulty"
      >
        {{ capitalize(difficulty) }}
      </button>
    </div>

    <div class="records-table">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Score</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in filteredRecords" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ record.score }}</td>
            <td>{{ formatTime(record.timeSpent) }}</td>
            <td>{{ formatDate(record.date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredRecords.length === 0" class="no-records">
      No records found for {{ capitalize(selectedDifficulty) }} difficulty.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { Difficulty } from '@/types/sudoku'
import type { GameRecord } from '@/types/sudoku'

const gameStore = useGameStore()
const difficulties = Object.values(Difficulty)
const selectedDifficulty = ref<Difficulty>(Difficulty.BEGINNER)

const filteredRecords = computed(() => {
  return gameStore
    .getScores(selectedDifficulty.value)
    .sort((a: GameRecord, b: GameRecord) => b.score - a.score)
    .slice(0, 10)
})

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.records {
  max-width: 800px;
  margin: 0 auto;
}

.records h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--secondary-color);
}

.difficulty-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: var(--background-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button.active {
  background-color: var(--primary-color);
  color: white;
}

.records-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background-color: var(--background-color);
  font-weight: 600;
}

tr:hover {
  background-color: var(--background-color);
}

.no-records {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  color: var(--text-color);
}

@media (max-width: 768px) {
  .difficulty-tabs {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1;
    min-width: 100px;
  }

  th,
  td {
    padding: 0.75rem;
  }
}
</style>
