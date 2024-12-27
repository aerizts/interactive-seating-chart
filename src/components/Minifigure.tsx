'use client';

import { useState } from 'react';
import { Person } from '@/types/seating';

interface MinifigureProps {
  person: Person;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export default function Minifigure({ person, isActive, onSelect }: MinifigureProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`
        relative w-32 h-40 cursor-pointer transition-transform duration-300
        ${hovered ? 'hover:-translate-y-2' : ''}
      `}
      onClick={() => onSelect(person.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Seat ${person.seatNumber} - ${person.name}`}
    >
      {/* Head */}
      <div className="absolute w-12 h-12 bg-yellow-300 rounded-full left-1/2 -translate-x-1/2 top-0" />

      {/* Body */}
      <div
        className={`
          absolute w-16 h-16 rounded-t-lg left-1/2 -translate-x-1/2 top-10
          transition-all duration-300
        `}
        style={{
          backgroundColor: person.outfit.color,
          backgroundImage: person.outfit.pattern === 'stripes'
            ? 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
            : person.outfit.pattern === 'checks'
            ? 'repeating-conic-gradient(rgba(0,0,0,0.1) 0% 25%, transparent 0% 50%) 50%/20px 20px'
            : 'none'
        }}
      />

      {/* Arms */}
      <div className={`
        absolute w-24 flex justify-between left-1/2 -translate-x-1/2
        transition-all duration-300 ease-in-out origin-top
        ${isActive ? 'top-10 rotate-[-120deg]' : 'top-12'}
      `}>
        <div className="w-4 h-8 bg-yellow-300 rounded" />
        <div className="w-4 h-8 bg-yellow-300 rounded" />
      </div>

      {/* Sign */}
      <div className={`
        absolute w-24 h-10 bg-white rounded-md shadow-md left-1/2 -translate-x-1/2
        transition-all duration-300 ease-in-out
        ${isActive ? 'top-0 rotate-0' : 'top-12 rotate-180'}
      `}>
        <div className={`
          w-full h-full flex items-center justify-center
          transition-all duration-300
          ${isActive ? 'rotate-0' : 'rotate-180'}
        `}>
          <span className="text-sm font-bold text-center truncate px-2">
            {person.name}
          </span>
        </div>
      </div>

      {/* Legs */}
      <div className="absolute w-12 flex justify-between left-1/2 -translate-x-1/2 bottom-2">
        <div className="w-4 h-6 bg-gray-500 rounded" />
        <div className="w-4 h-6 bg-green-500 rounded" />
      </div>
    </div>
  );
}
