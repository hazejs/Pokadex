import axios from 'axios';

const API_BASE = 'http://localhost:8080';

export interface Pokemon {
  number: number;
  name: string;
  type_one: string;
  type_two: string | null;
  total: number;
  hit_points: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  generation: number;
  legendary: boolean;
  captured: boolean;
}

export interface PokemonResponse {
  pokemon: Pokemon[];
  total: number;
  page: number;
  limit: number;
}

export const getPokemon = async (params: {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  type?: string;
  search?: string;
  captured?: boolean;
}) => {
  const response = await axios.get<PokemonResponse>(`${API_BASE}/pokemon`, {
    params,
  });
  return response.data;
};

export const toggleCapture = async (name: string) => {
  const response = await axios.post(`${API_BASE}/pokemon/${encodeURIComponent(name)}/toggle-capture`);
  return response.data;
};

export const getTypes = async () => {
  const response = await axios.get<string[]>(`${API_BASE}/types`);
  return response.data;
};

export const getIconUrl = (name: string) => {
  // Extract base name (e.g. "CharizardMega Charizard X" -> "charizard")
  // We'll split by the second capital letter if it exists to handle concatenated names
  const matches = name.match(/[A-Z][a-z]+/g);
  const baseName = matches ? matches[0] : name;

  const formattedName = baseName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[.']/g, '');
  return `${API_BASE}/icon/${formattedName}`;
};
