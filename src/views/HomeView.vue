<script setup lang="ts">
// Component logic will be added here if needed
</script>

<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to Sudoku Trial Day</h1>
      <p>
        Challenge yourself with our classic Sudoku game featuring multiple difficulty levels and a
        scoring system.
      </p>
      <router-link to="/game" class="btn btn-primary">Start Playing</router-link>
    </div>

    <div class="features grid grid-3">
      <div class="card">
        <h2>Multiple Difficulty Levels</h2>
        <p>Choose from Easy, Medium, Hard, and Expert levels to match your skill.</p>
      </div>

      <div class="card">
        <h2>Hint System</h2>
        <p>
          Get helpful hints when you're stuck, with a small score penalty to maintain challenge.
        </p>
      </div>

      <div class="card">
        <h2>Scoring System</h2>
        <p>Track your progress with our comprehensive scoring system and compete for top spots.</p>
      </div>
    </div>

    <div class="how-to-play card">
      <h2>How to Play</h2>
      <ol>
        <li>Select a difficulty level to start a new game.</li>
        <li>Fill in the empty cells with numbers from 1 to 9.</li>
        <li>
          Each row, column, and 3x3 box must contain all numbers from 1 to 9 without repetition.
        </li>
        <li>Use the hint system if you need help, but remember it affects your score.</li>
        <li>Complete the puzzle to save your score and compete for the top spot!</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}

.hero {
  padding: 4rem 0;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.hero p {
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 2rem;
}

.features {
  margin-bottom: 2rem;
}

.features .card {
  text-align: left;
}

.features h2 {
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.how-to-play {
  text-align: left;
}

.how-to-play h2 {
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.how-to-play ol {
  padding-left: 1.5rem;
}

.how-to-play li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 0;
  }

  .hero h1 {
    font-size: 2rem;
  }
}
</style>
