'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Minifigure from './MinifigureThreeD';
import ImportSeating from './ImportSeating';
import { samplePeople } from '@/data/sampleData';
import { Person } from '@/types/seating';

const MIN_SCALE = 0.2;
const MAX_SCALE = 1.0;
const PADDING = 48;
const MINIFIGURE_WIDTH = 100; // Reduced width for better proportions
const MINIFIGURE_HEIGHT = 140; // Reduced height for better proportions
const GRID_GAP = 24; // Slightly increased gap for better spacing
const SAFETY_MARGIN = 0.95; // Increased safety margin for better fit

export default function SeatingChart() {
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [people, setPeople] = useState<Person[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(true);
  const [scale, setScale] = useState(1);
  const [userScale, setUserScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Initialize with sample data
  useEffect(() => {
    const rows = Math.ceil(samplePeople.length / 4);
    const twoDArray: Person[][] = Array.from({ length: rows }, (_, i) =>
      samplePeople.slice(i * 4, (i + 1) * 4)
    );
    setPeople(twoDArray);
  }, []);

  // Calculate and apply optimal scaling
  const calculateOptimalScale = useCallback(() => {
    if (containerRef.current && gridRef.current && people.length > 0) {
      const container = containerRef.current;

      // Get container dimensions minus padding
      const availableWidth = container.clientWidth - (PADDING * 2);
      const availableHeight = container.clientHeight - (PADDING * 2);

      // Get grid dimensions
      const numCols = people[0].length;
      const numRows = people.length;

      // Calculate total required space including gaps
      const totalGapWidth = GRID_GAP * (numCols - 1);
      const totalGapHeight = GRID_GAP * (numRows - 1);
      const requiredWidth = (MINIFIGURE_WIDTH * numCols) + totalGapWidth;
      const requiredHeight = (MINIFIGURE_HEIGHT * numRows) + totalGapHeight;

      // Calculate scale factors with safety margin
      const widthScale = (availableWidth * SAFETY_MARGIN) / requiredWidth;
      const heightScale = (availableHeight * SAFETY_MARGIN) / requiredHeight;

      // Use the smaller scale to ensure everything fits, but within limits
      const optimalScale = Math.min(
        Math.max(Math.min(widthScale, heightScale), MIN_SCALE),
        MAX_SCALE
      );

      setScale(optimalScale);
    }
  }, [people]);

  // Handle window resize
  useEffect(() => {
    const debouncedCalculate = debounce(calculateOptimalScale, 100);

    if (!resizeObserverRef.current && containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(debouncedCalculate);
      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [calculateOptimalScale]);

  // Debounce function to prevent excessive recalculations
  const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  // Recalculate scale when people data changes
  useEffect(() => {
    calculateOptimalScale();
  }, [people, calculateOptimalScale]);

  const handleSelect = useCallback((id: string) => {
    setActivePersonId(prev => prev === id ? null : id);
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[role="button"]')) {
      setActivePersonId(null);
    }
  }, []);

  const handleImport = useCallback((data: Person[][]) => {
    const columnCount = data[0].length;
    const isValidGrid = data.every(row => row.length === columnCount);

    if (!isValidGrid) {
      setError('The imported table has inconsistent row lengths. Please ensure all rows have the same number of columns.');
      return;
    }

    setPeople(data);
    setShowImport(false);
    setError(null);
    setUserScale(1);

    // Allow time for DOM update before recalculating scale
    requestAnimationFrame(() => {
      calculateOptimalScale();
    });
  }, [calculateOptimalScale]);

  const handleImportError = useCallback((message: string) => {
    setError(message);
  }, []);

  const handleResetZoom = useCallback(() => {
    setUserScale(1);
  }, []);

  const handleZoomIn = useCallback(() => {
    setUserScale(prev => Math.min(prev * 1.2, MAX_SCALE / scale));
  }, [scale]);

  const handleZoomOut = useCallback(() => {
    setUserScale(prev => Math.max(prev * 0.8, MIN_SCALE / scale));
  }, [scale]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: `${PADDING}px` }}
        >
          <div
            ref={gridRef}
            className="transform-gpu transition-transform duration-300 ease-out origin-center"
            style={{
              transform: `scale(${scale * userScale})`,
            }}
          >
            <div
              className="grid"
              style={{
                gap: `${GRID_GAP}px`,
                gridTemplateColumns: people[0] ? `repeat(${people[0].length}, ${MINIFIGURE_WIDTH}px)` : 'none',
              }}
            >
              {people.map((row, rowIndex) => (
                row.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-center"
                    style={{
                      width: `${MINIFIGURE_WIDTH}px`,
                      height: `${MINIFIGURE_HEIGHT}px`,
                    }}
                  >
                    <Minifigure
                      person={person}
                      isActive={activePersonId === person.id}
                      onSelect={handleSelect}
                    />
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            aria-label="Zoom out"
            disabled={scale * userScale <= MIN_SCALE}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-sm text-gray-300 min-w-[4rem] text-center">
            {Math.round(scale * userScale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            aria-label="Zoom in"
            disabled={scale * userScale >= MAX_SCALE}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={handleResetZoom}
            className="ml-2 text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
            disabled={userScale === 1}
          >
            Reset
          </button>
        </div>
        <button
          onClick={() => setShowImport(true)}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Import New Seating
        </button>
      </div>

      {showImport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full mx-4 border border-gray-700">
            <ImportSeating onImport={handleImport} onError={handleImportError} />
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 text-red-300 rounded-lg border border-red-800">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
