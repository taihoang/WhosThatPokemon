'use client';

import { formatPokemonName } from '@/lib/pokeapi';

interface AnswerButtonProps {
  answer: string;
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function AnswerButton({
  answer,
  isSelected,
  isCorrect,
  isRevealed,
  onClick,
  disabled = false,
}: AnswerButtonProps) {
  const getButtonState = () => {
    if (!isRevealed) {
      return isSelected ? 'selected' : '';
    }
    if (isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    return '';
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled && !isRevealed) {
        onClick();
      }
    }
  };

  return (
    <button
      className={`answer-button ${getButtonState()}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || isRevealed}
      aria-pressed={isSelected}
      aria-label={`Select ${formatPokemonName(answer)}`}
    >
      <span className="answer-text">{formatPokemonName(answer)}</span>
      {isRevealed && isCorrect && (
        <span className="answer-icon" aria-hidden="true">✓</span>
      )}
      {isRevealed && isSelected && !isCorrect && (
        <span className="answer-icon" aria-hidden="true">✗</span>
      )}
    </button>
  );
}
