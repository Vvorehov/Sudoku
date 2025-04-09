# Sudoku Game

A modern Sudoku game built with Vue.js and TypeScript, featuring multiple difficulty levels, scoring system, and various game features.

## Features

- Four difficulty levels:
  - Beginner (36-40 cells visible)
  - Intermediate (32-36 cells visible)
  - Hard (28-32 cells visible)
  - Expert (24-28 cells visible)
- Real-time error checking
- Hint system (up to 10 hints)
- Scoring system:
  - +5 points for correct cells
  - -3 points for first hint, -4 for second, etc.
  - -1 point for errors
  - Time bonus (500 - time spent in seconds)
- Records table with top-3 scores per difficulty
- Draft mode for note-taking
- Undo/Redo functionality
- Pause/Resume game
- Available numbers tracking
- Responsive design

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Technologies Used

- Vue.js 3
- TypeScript
- Pinia (State Management)
- Vitest (Testing)
- CSS Grid

## Project Structure

```
src/
├── components/
│   └── SudokuGame.vue      # Main game component
├── services/
│   ├── sudokuService.ts    # Core game logic
│   └── __tests__/         # Unit tests
├── stores/
│   └── game.ts            # Game state management
├── types/
│   └── sudoku.ts          # TypeScript types
└── App.vue                # Root component
```

## Game Rules

1. Fill the 9x9 grid with numbers 1-9
2. Each row, column, and 3x3 box must contain unique numbers
3. Pre-filled cells cannot be modified
4. Use hints wisely as they reduce your score
5. Complete the puzzle as quickly as possible to maximize your time bonus
6. Try to achieve the highest score possible!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
