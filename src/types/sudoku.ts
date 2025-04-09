export type CellValue = number | null
export type Grid = CellValue[][]
export type Position = [number, number]

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  HARD = 'hard',
  EXPERT = 'expert',
  ADVANCED = 'advanced',
}

export interface Cell {
  value: CellValue
  isEditable: boolean
  isError: boolean
  isHint: boolean
  draftValues: number[]
}

export interface GameState {
  grid: Cell[][]
  difficulty: Difficulty
  score: number
  hintsUsed: number
  startTime: number
  endTime: number | null
  isComplete: boolean
  isPaused: boolean
  availableNumbers: Record<number, boolean>
}

export interface GameRecord {
  difficulty: Difficulty
  score: number
  date: string
  timeSpent: number
  name?: string
  isCurrentUser?: boolean
}

export interface GameSettings {
  difficulty: Difficulty
  maxHints: number
  baseScore: number
  timeBonus: number
  correctCellPoints: number
  hintPenalty: number
  errorPenalty: number
}
