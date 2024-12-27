'use client';

import { useState } from 'react';
import { Person } from '@/types/seating';

interface MinifigureProps {
  person: Person;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export default function MinifigureThreeD({ person, isActive, onSelect }: MinifigureProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`
        relative w-24 h-32 cursor-pointer
        transition-all duration-500 ease-in-out
        ${hovered ? 'hover:-translate-y-2 hover:scale-105' : ''}
      `}
      onClick={() => onSelect(person.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Seat ${person.seatNumber} - ${person.name}`}
    >
      {/* Head */}
      <div className="absolute w-8 h-8 bg-yellow-200 rounded-full left-1/2 -translate-x-1/2 top-2 shadow-sm" />

      {/* Body */}
      <div className="absolute w-12 h-12 bg-blue-500 rounded-lg left-1/2 -translate-x-1/2 top-9 shadow-sm">
        {/* Left Arm */}
        <div
          className={`
            absolute w-4 h-10 bg-yellow-200 -left-3 top-2 rounded-l-full shadow-sm
            transition-all duration-500 ease-in-out origin-top-right
            ${isActive ? '-rotate-90 -translate-y-2' : ''}
          `}
        />

        {/* Right Arm */}
        <div
          className={`
            absolute w-4 h-10 bg-yellow-200 -right-3 top-2 rounded-r-full shadow-sm
            transition-all duration-500 ease-in-out origin-top-left
            ${isActive ? 'rotate-90 -translate-y-2' : ''}
          `}
        />

        {/* Legs */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 flex justify-between">
          <div className="w-3 h-6 bg-blue-500 rounded-b-lg shadow-sm" />
          <div className="w-3 h-6 bg-blue-500 rounded-b-lg shadow-sm" />
        </div>
      </div>

      {/* Sign */}
      <div className={`
        absolute w-16 h-8 bg-white rounded-lg shadow-md border border-gray-200
        left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out
        ${isActive ? 'top-0 rotate-0' : 'top-11 rotate-180'}
      `}>
        <div className={`
          w-full h-full flex items-center justify-center
          transition-all duration-500 ease-in-out
          ${isActive ? 'rotate-0' : 'rotate-180'}
        `}>
          <span className="text-xs font-bold text-center truncate px-2">
            {person.name}
          </span>
        </div>
      </div>

      {/* Seat Number */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">
        {person.seatNumber}
      </div>
    </div>
  );
}
