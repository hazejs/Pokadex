import { useState, useEffect, useRef } from 'react';
import { getPokemon, toggleCapture, type Pokemon } from '../api';

interface PokemonParams {
  page: number;
  search: string;
  type: string;
  captured: string;
  sortBy: string;
  order: 'asc' | 'desc';
  limit: number;
}

export const usePokemonList = (
  params: PokemonParams,
  updateParams: (updates: Record<string, string | number | undefined>) => void
) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const isFirstMount = useRef(true);

  const { page, search, type, captured, sortBy, order, limit } = params;

  useEffect(() => {
    const fetchData = async (isInitial: boolean) => {
      if (isInitial) setInitialLoading(true);
      else setLoading(true);

      try {
        const currentLimit =
          isFirstMount.current && page > 1 ? page * limit : limit;
        const currentPage = isFirstMount.current && page > 1 ? 1 : page;

        const data = await getPokemon({
          page: currentPage,
          limit: currentLimit,
          search,
          type,
          captured: captured === '' ? undefined : captured === 'true',
          sortBy,
          order,
        });

        setPokemonList((prev) => {
          if (isInitial) return data.pokemon;

          const existingNames = new Set(prev.map((p) => p.name));
          const newItems = data.pokemon.filter(
            (p) => !existingNames.has(p.name)
          );
          return [...prev, ...newItems];
        });
        setTotal(data.total);
      } catch (error) {
        console.error('Failed to fetch pokemon:', error);
      } finally {
        if (isInitial) setInitialLoading(false);
        setLoading(false);
        isFirstMount.current = false;
      }
    };

    fetchData(page === 1 || isFirstMount.current);
  }, [page, search, type, captured, sortBy, order, limit]);

  const lastPokemonElementRef = (node: HTMLDivElement | null) => {
    if (loading || initialLoading || !node) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && pokemonList.length < total) {
        setLoading(true);
        updateParams({ page: page + 1 });
      }
    });

    observer.observe(node);
    // React 19: Functional refs can now return a cleanup function
    return () => observer.disconnect();
  };

  const handleToggleCapture = async (name: string) => {
    try {
      await toggleCapture(name);
      setPokemonList((prev) =>
        prev.map((p) => (p.name === name ? { ...p, captured: !p.captured } : p))
      );
    } catch (error) {
      console.error('Failed to toggle capture:', error);
      throw error;
    }
  };

  return {
    pokemonList,
    total,
    loading,
    initialLoading,
    lastPokemonElementRef,
    handleToggleCapture,
  };
};
