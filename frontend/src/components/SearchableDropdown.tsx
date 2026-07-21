import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SearchableDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export default function SearchableDropdown({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select or type...",
  className = ""
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value || '');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  // Remove duplicates from options if any, and filter based on search
  const uniqueOptions = Array.from(new Set(options));
  const exactMatch = uniqueOptions.some(opt => opt.toLowerCase() === search.toLowerCase());
  const filteredOptions = uniqueOptions.filter(opt => 
    exactMatch ? true : opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={(e) => { setIsOpen(true); e.target.select(); }}
        className={`w-full bg-[#f4f7fb] border border-slate-200 rounded text-sm py-2.5 pl-3 pr-10 text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-400 transition-all duration-200 outline-none ${className}`}
        placeholder={placeholder}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100">
          {filteredOptions.map((opt, i) => (
            <div
              key={i}
              className="px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer font-medium transition-colors"
              onClick={() => {
                setSearch(opt);
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
