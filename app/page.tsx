'use client';

import { useState, useEffect } from 'react';
import { Difficulty, GameState } from '@/types/pokemon';
import PokemonSilhouette from '@/components/PokemonSilhouette';
import AnswerButton from '@/components/AnswerButton';
import ScoreBoard from '@/components/ScoreBoard';
import DifficultySelector from '@/components/DifficultySelector';
import SoundToggle from '@/components/SoundToggle';
import {
  fetchPokemonById,
  getRandomPokemonNames,
  getRandomPokemonId,
  getAllPokemonNames,
} from '@/lib/pokeapi';

const NUM_OPTIONS = 6;

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    currentPokemon: null,
    options: [],
    correctAnswer: '',
    selectedAnswer: null,
    score: 0,
    difficulty: 'easy',
    isLoading: true,
    isRevealed: false,
    round: 0,
  });
  
  const [pokemonMap, setPokemonMap] = useState<Map<number, string>>(new Map());
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const init = async () => {
      const map = await getAllPokemonNames();
      setPokemonMap(map);
      
      if (map.size > 0) {
        await loadNewPokemon('easy', map);
      }
    };

    init();
  }, []);

  const loadNewPokemon = async (difficulty: Difficulty, map: Map<number, string>) => {
    setGameState(prev => ({
      ...prev,
      isLoading: true,
      isRevealed: false,
      selectedAnswer: null,
    }));

    try {
      const pokemonId = getRandomPokemonId(map, difficulty);
      const pokemon = await fetchPokemonById(pokemonId);

      const wrongAnswers = getRandomPokemonNames(
        map,
        pokemonId,
        NUM_OPTIONS - 1,
        difficulty
      );

      const allOptions = [pokemon.name, ...wrongAnswers];
      const shuffled = allOptions.sort(() => Math.random() - 0.5);

      setGameState(prev => ({
        ...prev,
        currentPokemon: pokemon,
        options: shuffled,
        correctAnswer: pokemon.name,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading Pokémon:', error);
      setGameState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const selectAnswer = (answer: string) => {
    if (gameState.isRevealed || gameState.isLoading) return;

    const isCorrect = answer === gameState.correctAnswer;
    const newScore = isCorrect ? gameState.score + 1 : gameState.score;

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer,
      isRevealed: true,
      score: newScore,
    }));

    if (soundEnabled && gameState.currentPokemon?.cry) {
      try {
        const audio = new Audio(gameState?.currentPokemon?.cry);
        audio.play().catch(() => {});
      } catch (error) {
        console.log(error);
      }
    }
  };

  const nextRound = () => {
    setGameState(prev => ({
      ...prev,
      round: prev.round + 1,
    }));
    loadNewPokemon(gameState.difficulty, pokemonMap);
  };

  const changeDifficulty = (difficulty: Difficulty) => {
    setGameState(prev => ({
      ...prev,
      difficulty,
      round: 0,
      score: 0,
    }));
    loadNewPokemon(difficulty, pokemonMap);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <main className="game-container">
      <header className="game-header">
        <h1 className="game-title">Who&apos;s That Pokémon?</h1>
        <div className="header-controls">
          <DifficultySelector
            difficulty={gameState.difficulty}
            onDifficultyChange={changeDifficulty}
            disabled={gameState.isLoading}
          />
          <SoundToggle enabled={soundEnabled} onToggle={handleSoundToggle} />
        </div>
      </header>

      <ScoreBoard score={gameState.score} round={gameState.round} />

      <div className="game-content">
        <PokemonSilhouette
          pokemon={gameState.currentPokemon}
          isRevealed={gameState.isRevealed}
          isLoading={gameState.isLoading}
        />

        {!gameState.isLoading && gameState.options.length > 0 && (
          <div className="answers-container">
            {gameState.options.map((answer) => (
              <AnswerButton
                key={answer}
                answer={answer}
                isSelected={gameState.selectedAnswer === answer}
                isCorrect={answer === gameState.correctAnswer}
                isRevealed={gameState.isRevealed}
                onClick={() => selectAnswer(answer)}
              />
            ))}
          </div>
        )}

        {gameState.isRevealed && (
          <div className="reveal-actions">
            <button className="next-button" onClick={nextRound}>
              Next Pokémon
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
