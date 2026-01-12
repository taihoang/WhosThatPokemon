export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  cry?: string;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  minId: number;
  maxId: number;
  label: string;
}

export interface GameState {
  currentPokemon: Pokemon | null;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  score: number;
  difficulty: Difficulty;
  isLoading: boolean;
  isRevealed: boolean;
  round: number;
}
