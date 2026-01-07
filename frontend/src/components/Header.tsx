import React from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  localSearch: string;
  setLocalSearch: (s: string) => void;
  type: string;
  types: string[];
  captured: string;
  sortBy: string;
  order: string;
  limit: number;
  updateParams: (updates: Record<string, string | number | undefined>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  localSearch,
  setLocalSearch,
  type,
  types,
  captured,
  sortBy,
  order,
  limit,
  updateParams,
}) => {
  const typeOptions = [
    { label: 'All Types', value: '' },
    ...types.map((t) => ({ label: t, value: t })),
  ];

  const capturedOptions = [
    { label: 'All Status', value: '' },
    { label: 'Captured', value: 'true' },
  ];

  const sortOptions = [
    { label: 'Sort: Low-High', value: 'number-asc' },
    { label: 'Sort: High-Low', value: 'number-desc' },
    { label: 'Sort: A-Z', value: 'name-asc' },
    { label: 'Sort: Z-A', value: 'name-desc' },
  ];

  const limitOptions = [10, 20, 50, 100].map((l) => ({
    label: `${l} Per Load`,
    value: l,
  }));

  return (
    <header className='sticky top-0 z-20 bg-white/70 dark:bg-[#16191E]/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 p-4'>
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-black bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent'>
            POKÉDEX
          </h1>
          <div className='flex lg:hidden gap-2'>
            <button
              onClick={toggleTheme}
              className='p-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer'
            >
              {theme === 'light' ? (
                <Moon className='w-5 h-5' />
              ) : (
                <Sun className='w-5 h-5' />
              )}
            </button>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <div className='relative flex-1 md:flex-none'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search everything...'
              className='pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#1A1D23] focus:ring-2 focus:ring-rose-500/20 outline-none w-full md:w-64 transition-all cursor-pointer text-sm font-medium placeholder:text-gray-400'
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <CustomDropdown
            options={typeOptions}
            value={type}
            onChange={(val) => updateParams({ type: val })}
            className='w-full md:w-40'
          />

          <CustomDropdown
            options={capturedOptions}
            value={captured}
            onChange={(val) => updateParams({ captured: val })}
            className='w-full md:w-36'
          />

          <CustomDropdown
            options={sortOptions}
            value={`${sortBy}-${order}`}
            onChange={(val) => {
              const [newSort, newOrder] = val.split('-');
              updateParams({ sortBy: newSort, order: newOrder });
            }}
            className='w-full md:w-44'
          />

          <CustomDropdown
            options={limitOptions}
            value={limit}
            onChange={(val) => updateParams({ limit: val, page: 1 })}
            className='w-full md:w-36'
          />

          <div className='hidden lg:flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4 ml-1'>
            <button
              onClick={toggleTheme}
              className='p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer'
            >
              {theme === 'light' ? (
                <Moon className='w-5 h-5' />
              ) : (
                <Sun className='w-5 h-5' />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
