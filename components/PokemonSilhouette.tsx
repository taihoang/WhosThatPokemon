'use client';

import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';
import { formatPokemonName } from '@/lib/pokeapi';
import { useState, useEffect } from 'react';

interface PokemonSilhouetteProps {
  pokemon: Pokemon | null;
  isRevealed: boolean;
  isLoading?: boolean;
}

export default function PokemonSilhouette({ 
  pokemon, 
  isRevealed, 
  isLoading = false 
}: PokemonSilhouetteProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [pokemon?.id]);

  if (isLoading || !pokemon) {
    return (
      <div className="pokemon-container loading">
        <div className="pokemon-skeleton">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className={`pokemon-container ${isRevealed ? 'revealed' : ''}`}>
      <div className="pokemon-image-wrapper">
        {!imageError ? (
          <Image
            src={pokemon.sprite}
            alt={isRevealed ? formatPokemonName(pokemon.name) : 'Who\'s that Pokémon?'}
            width={400}
            height={400}
            className="pokemon-image"
            onError={() => setImageError(true)}
            priority
            unoptimized
          />
        ) : (
          <div className="pokemon-image-error">
            <span>Image not available</span>
          </div>
        )}
      </div>
      {isRevealed && (
        <h2 className="pokemon-name revealed-name">
          {formatPokemonName(pokemon.name)}
        </h2>
      )}
    </div>
  );
}
