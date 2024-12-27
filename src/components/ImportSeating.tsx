'use client';

import { useState, useCallback } from 'react';
import { read, utils } from 'xlsx';
import { Person } from '@/types/seating';

interface ImportSeatingProps {
  onImport: (data: Person[][]) => void;
  onError: (message: string) => void;
}

export default function ImportSeating({ onImport, onError }: ImportSeatingProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<{ rows: number; cols: number } | null>(null);

  const processFile = useCallback(async (file: File) => {
    try {
      // Check file type and extension
      const validExtensions = /\.(xlsx|xls|csv)$/i;
      if (!validExtensions.test(file.name)) {
        throw new Error('Please upload a valid Excel or CSV file');
      }

      // Read file with proper encoding
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer, {
        type: 'array',
        codepage: 65001, // UTF-8 encoding
        raw: false
      });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<string[]>(worksheet, {
        header: 1,
        defval: '', // Default value for empty cells
        blankrows: false // Skip empty rows
      });

      // Remove empty rows and columns
      const cleanData = jsonData
        .filter(row => row.some(cell => cell !== ''))
        .map(row => row.map(cell => String(cell || '').trim()));

      // Validate grid structure
      if (cleanData.length === 0) {
        throw new Error('The file appears to be empty or contains no valid data');
      }

      const columnCount = cleanData[0].length;
      const isValidGrid = cleanData.every(row => row.length === columnCount);

      if (!isValidGrid) {
        throw new Error('The table has inconsistent row lengths. Please ensure all rows have the same number of columns.');
      }

      // Show preview
      setPreview({
        rows: cleanData.length,
        cols: columnCount
      });

      // Process data into Person objects
      const seatingData: Person[][] = cleanData.map((row, rowIndex) =>
        row.map((cell, colIndex) => ({
          id: `${rowIndex}-${colIndex}`,
          name: cell,
          seatNumber: rowIndex * row.length + colIndex + 1,
          expression: 'smile',
          outfit: {
            color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
            pattern: ['stripes', 'checks', 'solid'][Math.floor(Math.random() * 3)] as 'stripes' | 'checks' | 'solid'
          }
        }))
      );

      onImport(seatingData);
    } catch (error) {
      setPreview(null);
      onError(error instanceof Error ? error.message : 'Failed to process file');
    }
  }, [onImport, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  return (
    <div className="space-y-4">
      <div
        className={`
          relative p-8 border-2 border-dashed rounded-lg
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Import seating arrangement file"
        />
        <div className="text-center">
          <div className="text-gray-600 mb-2">
            Drag and drop your seating arrangement file here
          </div>
          <div className="text-sm text-gray-500">
            Supported formats: Excel (.xlsx, .xls) and CSV
          </div>
          <div className="text-xs text-gray-400 mt-2">
            支持中文字符 / Supports Chinese characters
          </div>
        </div>
      </div>

      {preview && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Table Structure Preview</h3>
          <div className="flex gap-4">
            <div className="text-sm text-blue-800">
              Rows: {preview.rows}
            </div>
            <div className="text-sm text-blue-800">
              Columns: {preview.cols}
            </div>
          </div>
          <div className="text-xs text-pink-600 mt-2">
            The seating chart will be arranged in a {preview.rows} × {preview.cols} grid
          </div>
        </div>
      )}
    </div>
  );
}
