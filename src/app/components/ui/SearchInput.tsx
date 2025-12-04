'use client';

import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showClearButton?: boolean;
  icon?: React.ReactNode;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton, icon, className = '', ...props }, ref) => {
    const hasValue = props.value && String(props.value).length > 0;
    const showClear = showClearButton !== false && hasValue && onClear;

    return (
      <div className="relative flex-1 max-w-3xl mx-auto">
        {icon || (
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        )}
        <input
          ref={ref}
          type="text"
          className={`
            w-full pl-12 pr-12 py-3 text-lg 
            border border-gray-300 rounded-lg 
            bg-white text-black placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#Ed3237] focus:border-transparent
            transition-all duration-200
            ${className}
          `}
          style={{
            color: '#000000',
          }}
          {...props}
        />
        {showClear && (
          <button
            onClick={onClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;

