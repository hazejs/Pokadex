import React, { useEffect, useState, useRef, useTransition } from 'react';
import { preload } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { getPokemon, getTypes, toggleCapture, type Pokemon } from './api';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { PokemonCard } from './components/PokemonCard';
import { MainLoader, InfiniteLoader } from './components/Loader';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [, startFilterTransition] = useTransition();

  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(
    searchParams.get('search') || ''
  );
  const isFirstMount = useRef(true);

  // Sync state with URL
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const captured = searchParams.get('captured') || '';
  const sortBy = searchParams.get('sortBy') || 'number';
  const order = (searchParams.get('order') || 'asc') as 'asc' | 'desc';
  const limit = parseInt(searchParams.get('limit') || '20');

  const lastPokemonElementRef = (node: HTMLDivElement | null) => {
    if (loading || initialLoading || !node) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && pokemonList.length < total) {
        setLoading(true); // Show loader immediately
        updateParams({ page: page + 1 });
      }
    });

    observer.observe(node);
    // React 19: Functional refs can now return a cleanup function
    return () => observer.disconnect();
  };

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

        // Use an ID-based check for faster filtering
        const existingNames = new Set(prev.map((p) => p.name));
        const newItems = data.pokemon.filter((p) => !existingNames.has(p.name));
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

  // Debounce search input with Transition
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (localSearch !== currentSearch) {
        updateParams({ search: localSearch, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Save scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Throttle scroll updates
      if (!window.requestAnimationFrame) {
        sessionStorage.setItem('scrollPos', window.scrollY.toString());
      } else {
        window.requestAnimationFrame(() => {
          sessionStorage.setItem('scrollPos', window.scrollY.toString());
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore scroll position
  useEffect(() => {
    if (!initialLoading && isFirstMount.current === false) {
      const savedPos = sessionStorage.getItem('scrollPos');
      if (savedPos) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPos), behavior: 'smooth' });
        }, 100);
      }
    }
  }, [initialLoading]);

  // Sync localSearch when URL changes
  useEffect(() => {
    setLocalSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    getTypes().then(setTypes).catch(console.error);
    // React 19: Preload important assets
    preload(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
      { as: 'image' }
    );
  }, []);

  useEffect(() => {
    fetchData(page === 1 || isFirstMount.current);
  }, [page, search, type, captured, sortBy, order, limit]);

  const updateParams = (
    updates: Record<string, string | number | undefined>
  ) => {
    const performUpdate = () => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      if (updates.page === undefined) {
        newParams.set('page', '1');
      }
      setSearchParams(newParams);
    };

    // Only use transition for filters/search/sort, not for pagination
    if (updates.page !== undefined) {
      performUpdate();
    } else {
      startFilterTransition(performUpdate);
    }
  };

  const handleToggleCapture = async (name: string) => {
    // Note: PokemonCard uses useOptimistic so the UI updates locally first.
    // This function handles the actual API call and final state sync.
    try {
      await toggleCapture(name);
      setPokemonList((prev) =>
        prev.map((p) => (p.name === name ? { ...p, captured: !p.captured } : p))
      );
    } catch (error) {
      console.error('Failed to toggle capture:', error);
      throw error; // Let PokemonCard handle the revert via useOptimistic
    }
  };

  return (
    <div className='min-h-screen bg-[#F7F6F3] dark:bg-[#0B0D0E] text-gray-900 dark:text-gray-100 transition-colors duration-500'>
      {/* React 19 Native Metadata Hoisting */}
      <title>Pokédex | {total} found</title>
      <link
        rel='icon'
        href='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
      />

      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        localSearch={localSearch}
        setLocalSearch={setLocalSearch}
        type={type}
        types={types}
        captured={captured}
        sortBy={sortBy}
        order={order}
        limit={limit}
        updateParams={updateParams}
      />

      <main className={`max-w-7xl mx-auto p-4 md:p-8`}>
        <div className='flex justify-between items-center mb-8'>
          <div className='px-4 py-1.5 rounded-full bg-white dark:bg-[#16191E] shadow-sm border border-white dark:border-white/5 text-sm font-medium'>
            <span className='text-rose-500 font-bold'>{total}</span> Pokemons
            Found
          </div>
        </div>

        {initialLoading && <MainLoader />}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {pokemonList.map((p, index) => (
            <PokemonCard
              key={p.name}
              p={p}
              onToggleCapture={handleToggleCapture}
              ref={
                index === pokemonList.length - 1
                  ? lastPokemonElementRef
                  : undefined
              }
            />
          ))}
        </div>

        {loading && !initialLoading && pokemonList.length < total && (
          <InfiniteLoader />
        )}

        {!initialLoading && pokemonList.length === 0 && (
          <div className='text-center py-40'>
            <div className='text-6xl mb-4 text-gray-300 dark:text-gray-700'>
              🔍
            </div>
            <p className='text-2xl font-black text-gray-300 dark:text-gray-700 uppercase tracking-tighter'>
              No Pokemon found in the wild...
            </p>
          </div>
        )}

        {!initialLoading && pokemonList.length >= total && total > 0 && (
          <div className='text-center py-20 text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest text-sm'>
            You've reached the end of the Pokédex
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
