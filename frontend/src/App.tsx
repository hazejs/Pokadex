import React, { useEffect, useState } from 'react';
import { preload } from 'react-dom';
import { getTypes } from './api';
import { useTheme } from './hooks/useTheme';
import { usePokemonParams } from './hooks/usePokemonParams';
import { usePokemonList } from './hooks/usePokemonList';
import { useScrollRestoration } from './hooks/useScrollRestoration';
import { Header } from './components/Header';
import { PokemonCard } from './components/PokemonCard';
import { MainLoader, InfiniteLoader } from './components/Loader';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { params, updateParams, searchParams } = usePokemonParams();
  const {
    pokemonList,
    total,
    loading,
    initialLoading,
    lastPokemonElementRef,
    handleToggleCapture,
  } = usePokemonList(params, updateParams);

  const [types, setTypes] = useState<string[]>([]);
  const [localSearch, setLocalSearch] = useState(
    searchParams.get('search') || ''
  );
  const [prevUrlSearch, setPrevSearch] = useState(
    searchParams.get('search') || ''
  );

  const urlSearch = searchParams.get('search') || '';
  if (urlSearch !== prevUrlSearch) {
    setPrevSearch(urlSearch);
    setLocalSearch(urlSearch);
  }

  useScrollRestoration(initialLoading);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (localSearch !== currentSearch) {
        updateParams({ search: localSearch, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, updateParams, searchParams]);

  useEffect(() => {
    getTypes().then(setTypes).catch(console.error);
    // React 19 - Preload important assets
    preload(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
      { as: 'image' }
    );
  }, []);

  return (
    <div className='min-h-screen bg-[#F7F6F3] dark:bg-[#0B0D0E] text-gray-900 dark:text-gray-100 transition-colors duration-500'>
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
        type={params.type}
        types={types}
        captured={params.captured}
        sortBy={params.sortBy}
        order={params.order}
        limit={params.limit}
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
