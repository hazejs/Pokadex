import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string | number;
}

interface CustomDropdownProps {
  options: Option[];
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#1A1D23] text-left flex items-center justify-between transition-all hover:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 outline-none cursor-pointer group'
      >
        <span className='truncate mr-2 text-sm font-medium'>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-rose-500' : ''
          }`}
        />
      </button>

      <div
        className={`absolute top-full left-0 right-0 mt-2 py-2 bg-white dark:bg-[#1A1D23] rounded-xl shadow-2xl border border-gray-100 dark:border-white/5 z-50 transition-all duration-300 origin-top ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 visible'
            : 'opacity-0 -translate-y-2 scale-95 invisible'
        }`}
      >
        <div className='max-h-60 overflow-y-auto custom-scrollbar'>
          {options.map((option) => (
            <button
              key={option.value}
              type='button'
              onClick={() => {
                onChange(String(option.value));
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
                option.value === value
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  option.value === value
                    ? 'bg-red-500 scale-100'
                    : 'bg-transparent scale-0'
                }`}
              />
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
