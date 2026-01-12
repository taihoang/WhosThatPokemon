'use client';

import { Difficulty } from '@/types/pokemon';
import { DIFFICULTY_CONFIGS } from '@/lib/pokeapi';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

export default function DifficultySelector({
  difficulty,
  onDifficultyChange,
  disabled = false,
}: DifficultySelectorProps) {
  return (
    <div className="difficulty-selector">
      <label htmlFor="difficulty-select" className="difficulty-label">
        Difficulty:
      </label>
      <select
        id="difficulty-select"
        value={difficulty}
        onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
        disabled={disabled}
        className="difficulty-select"
        aria-label="Select difficulty level"
      >
        {Object.entries(DIFFICULTY_CONFIGS).map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </select>
    </div>
  );
}
