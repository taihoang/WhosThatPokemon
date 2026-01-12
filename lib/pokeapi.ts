import { Pokemon, PokemonListItem, Difficulty, DifficultyConfig } from '@/types/pokemon';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    minId: 1,
    maxId: 151,
    label: 'Easy (Gen 1)',
  },
  medium: {
    minId: 1,
    maxId: 386,
    label: 'Medium (Gen 1-3)',
  },
  hard: {
    minId: 1,
    maxId: 1025, // Approximate max, will be fetched dynamically
    label: 'Hard (All)',
  },
};

/**
 * Fetches all Pokémon names from the API
 * Returns a map of pokemon ID to name for efficient lookup
 */
export async function getAllPokemonNames(): Promise<Map<number, string>> {
  try {
    const pokemonMap = new Map<number, string>();
    let nextUrl: string | null = `${POKEAPI_BASE_URL}/pokemon?limit=1000`;
    
    // Fetch all pokemon in batches
    while (nextUrl) {
      const response: Response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon list');
      }
      const data: { results: PokemonListItem[]; next: string | null } = await response.json();
      
      // Extract ID from URL and store name
      data.results.forEach((pokemon: PokemonListItem) => {
        const id = parseInt(pokemon.url.split('/').filter(Boolean).pop() || '0');
        if (id > 0) {
          pokemonMap.set(id, pokemon.name);
        }
      });
      
      nextUrl = data.next;
    }
    
    return pokemonMap;
  } catch (error) {
    console.error('Error fetching Pokémon names:', error);
    return new Map(); // Return empty map on error
  }
}

/**
 * Gets a random Pokémon ID within the difficulty range from the cached list
 */
export function getRandomPokemonId(
  pokemonMap: Map<number, string>,
  difficulty: Difficulty
): number {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const availableIds: number[] = [];

  pokemonMap.forEach((name, id) => {
    if (id >= config.minId && id <= config.maxId) {
      availableIds.push(id);
    }
  });

  if (availableIds.length === 0) {
    return config.minId; // Fallback
  }

  const randomIndex = Math.floor(Math.random() * availableIds.length);
  return availableIds[randomIndex];
}

/**
 * Fetches Pokémon data by ID
 */
export async function fetchPokemonById(id: number): Promise<Pokemon> {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon ${id}`);
    }
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      sprite: data.sprites.other['official-artwork'].front_default || 
              data.sprites.front_default || 
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      cry: data.cries?.latest || data.cries?.legacy,
    };
  } catch (error) {
    console.error(`Error fetching Pokémon ${id}:`, error);
    throw error;
  }
}

/**
 * Gets random Pokémon names from the cached list
 */
export function getRandomPokemonNames(
  pokemonMap: Map<number, string>,
  excludeId: number,
  count: number,
  difficulty: Difficulty
): string[] {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const names: string[] = [];
  const usedIds = new Set([excludeId]);
  const availableIds: number[] = [];

  pokemonMap.forEach((name, id) => {
    if (id >= config.minId && id <= config.maxId) {
      availableIds.push(id);
    }
  });

  // Randomly select names
  while (names.length < count && availableIds.length > usedIds.size) {
    const randomIndex = Math.floor(Math.random() * availableIds.length);
    const randomId = availableIds[randomIndex];
    
    if (!usedIds.has(randomId)) {
      usedIds.add(randomId);
      const name = pokemonMap.get(randomId);
      if (name) {
        names.push(name);
      }
    }
  }

  return names;
}

/**
 * Formats Pokémon name to title case
 */
export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
