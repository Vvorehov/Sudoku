<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <h1>Sudoku Trial Day</h1>
        <nav>
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/game" class="nav-link">Play</router-link>
          <router-link to="/records" class="nav-link">Records</router-link>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Sudoku Trial Day. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here if needed
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--secondary-color);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link + .nav-link {
  margin-left: 1rem;
}

.app-main {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  background-color: var(--secondary-color);
  color: white;
  padding: 1rem 0;
  text-align: center;
}

@media (max-width: 768px) {
  .app-header .container {
    flex-direction: column;
    text-align: center;
  }

  .app-header h1 {
    margin-bottom: 1rem;
  }

  .nav-link + .nav-link {
    margin-left: 0.5rem;
  }
}
</style>
