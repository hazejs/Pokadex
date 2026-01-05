import React from 'react';

export const MainLoader: React.FC = () => (
  <div className='fixed inset-0 z-50 flex flex-col justify-center items-center pointer-events-none gap-4'>
    <div className='relative w-20 h-20 bg-white/40 dark:bg-gray-900/40 p-4 rounded-full backdrop-blur-sm'>
      <div className='absolute inset-0 border-8 border-red-500/20 rounded-full'></div>
      <div className='absolute inset-0 border-8 border-red-500 border-t-transparent rounded-full animate-spin'></div>
    </div>
  </div>
);

export const InfiniteLoader: React.FC = () => (
  <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-2xl border border-red-500/20'>
    <div className='relative w-10 h-10'>
      <div className='absolute inset-0 border-4 border-red-500/20 rounded-full'></div>
      <div className='absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin'></div>
    </div>
    <p className='text-[10px] font-black text-red-600 dark:text-red-500 animate-pulse tracking-widest'>
      LOADING MORE...
    </p>
  </div>
);

