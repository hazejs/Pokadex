import React, { useOptimistic, useTransition } from 'react';
import {
  CheckCircle2,
  Circle,
  Zap,
  Shield,
  Heart,
  Swords,
  type LucideIcon,
} from 'lucide-react';
import { getIconUrl, type Pokemon } from '../api';

interface PokemonCardProps {
  p: Pokemon;
  onToggleCapture: (name: string) => Promise<void>;
  ref?: (node: HTMLDivElement | null) => void;
}

interface StatConfig {
  label: string;
  icon: LucideIcon;
  key: keyof Pokemon;
  color: string;
  text: string;
}

const statConfig: StatConfig[] = [
  {
    label: 'HP',
    icon: Heart,
    key: 'hit_points',
    color: 'bg-emerald-500',
    text: 'text-emerald-500',
  },
  {
    label: 'ATK',
    icon: Swords,
    key: 'attack',
    color: 'bg-rose-500',
    text: 'text-rose-500',
  },
  {
    label: 'DEF',
    icon: Shield,
    key: 'defense',
    color: 'bg-sky-500',
    text: 'text-sky-500',
  },
  {
    label: 'SPD',
    icon: Zap,
    key: 'speed',
    color: 'bg-amber-500',
    text: 'text-amber-500',
  },
];

export const PokemonCard: React.FC<PokemonCardProps> = ({
  p,
  onToggleCapture,
  ref,
}) => {
  const [, startTransition] = useTransition();
  const [optimisticCaptured, addOptimisticCaptured] = useOptimistic(
    p.captured,
    (_, newCaptured: boolean) => newCaptured
  );

  const handleCaptureClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // ⚡ INSTANT UPDATE: Use React 19 Action pattern
    startTransition(async () => {
      addOptimisticCaptured(!p.captured);
      await onToggleCapture(p.name);
    });
  };

  return (
    <div
      ref={ref}
      className={`group relative flex flex-col bg-white dark:bg-[#16191E] rounded-[2rem] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white dark:border-white/5 overflow-hidden animate-slide-up transition-transform duration-500 ${
        optimisticCaptured ? 'ring-2 ring-emerald-500/20' : 'ring-0'
      }`}
    >
      {/* Top Section: Image & Number */}
      <div className='relative aspect-square overflow-hidden bg-gray-50/50 dark:bg-gray-900/20'>
        <div className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]'></div>
        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_70%)]'></div>

        <img
          src={getIconUrl(p.name)}
          alt={p.name}
          className='w-full h-full object-contain p-10 transform transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3 drop-shadow-2xl'
          loading='lazy'
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
          }}
        />

        {/* Action Button - No transitions here for absolute speed */}
        <button
          onClick={handleCaptureClick}
          className={`absolute top-6 right-6 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer active:scale-90 ${
            optimisticCaptured
              ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20'
              : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'
          }`}
        >
          <span className='text-[10px] font-black uppercase tracking-widest'>
            {optimisticCaptured ? 'Captured' : 'Capture'}
          </span>
          {optimisticCaptured ? (
            <CheckCircle2 className='w-4 h-4' />
          ) : (
            <Circle className='w-4 h-4' />
          )}
        </button>
      </div>

      {/* Bottom Section: Info */}
      <div className='flex-1 p-8 pt-6'>
        <div className='mb-6'>
          <h3 className='text-2xl font-black text-gray-800 dark:text-white tracking-tight mb-3 group-hover:text-rose-500 transition-colors duration-300'>
            {p.name.toUpperCase()}
          </h3>
          <div className='flex flex-wrap gap-2'>
            {[p.type_one, p.type_two].filter(Boolean).map((t) => (
              <span
                key={t}
                className='px-4 py-1 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] bg-gray-100/80 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border border-transparent group-hover:border-rose-500/10 group-hover:bg-rose-500/5 group-hover:text-rose-500 transition-all duration-300'
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
          {statConfig.map((stat) => (
            <div key={stat.label} className='space-y-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <stat.icon className={`w-3 h-3 ${stat.text} opacity-70`} />
                  <span className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>
                    {stat.label}
                  </span>
                </div>
                <span className='text-xs font-black text-gray-700 dark:text-gray-300'>
                  {p[stat.key] as number}
                </span>
              </div>
              <div className='h-1 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden'>
                <div
                  className={`h-full ${stat.color} transition-all duration-1000 ease-out origin-left`}
                  style={{
                    width: `${Math.min(
                      100,
                      ((p[stat.key] as number) / 150) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
