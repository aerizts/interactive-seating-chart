# Interactive Seating Chart Application

A modern web application built with Next.js 13+ (App Router), React, TypeScript, and TailwindCSS. This application provides an interactive seating arrangement system with animated LEGO-style minifigures.

## Technical Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: TailwindCSS
- **File Processing**: xlsx library for Excel/CSV import
- **Package Manager**: npm

## Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── error.tsx          # Error handling
├── components/            # React components
│   ├── MinifigureThreeD.tsx   # 3D minifigure component
│   ├── SeatingChart.tsx       # Main layout component
│   └── ImportSeating.tsx      # File import component
├── types/                # TypeScript type definitions
│   └── seating.ts
└── styles/              # Global styles and Tailwind config
```

## Component Modification Guide

### Minifigure Customization (`src/components/MinifigureThreeD.tsx`)

#### Visual Dimensions
- Overall minifigure size: Modify `w-24 h-32` in the root container div
- Head size: Adjust `w-8 h-8` in the Head component
- Body size: Change `w-12 h-12` in the Body component
- Arm dimensions: Update `w-4 h-10` in Left/Right Arm components
- Leg size: Modify `w-3 h-6` in the Legs component

#### Positioning
- Head position: Adjust `top-2` in Head component
- Body position: Change `top-9` in Body component
- Arms position: Modify `-left-3`/`-right-3` and `top-2` in Arm components
- Legs position: Update `-bottom-6` in Legs container

#### Colors
- Skin color: Change `bg-yellow-200` in Head and Arms
- Body color: Modify `bg-blue-500` in Body component
- Sign color: Update `bg-white` and border colors in Sign component

#### Animations
- Hover effect: Modify `hover:-translate-y-2 hover:scale-105` in root container
- Sign rotation: Adjust rotation values in Sign component
- Arms movement: Update rotation and translation values in Arm components

### Error Handling (`src/app/error.tsx`)
- Error UI: Modify the error component in error.tsx
- Error styles: Update Tailwind classes for error presentation
- Error recovery: Customize the reset functionality
- Development mode: Adjust error details display

### Layout Configuration (`src/components/SeatingChart.tsx`)
- Grid spacing: Modify `GRID_GAP` constant
- Padding: Adjust `PADDING` constant
- Minifigure dimensions: Update `MINIFIGURE_WIDTH` and `MINIFIGURE_HEIGHT`
- Safety margin: Change `SAFETY_MARGIN` for scaling calculations

### Import Functionality (`src/components/ImportSeating.tsx`)
- File formats: Modify `validExtensions` regex
- Character encoding: Adjust `codepage` in file reading options
- Data cleaning: Update the filtering logic in `processFile`
- UI customization: Modify the drop zone and preview styles

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Key Features

- Interactive minifigures with animations
- CSV/Excel file import support
- Dynamic grid layout
- Responsive design
- Zoom controls
- Chinese character support
- Built-in error handling

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- CSS Grid support required

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

```
Main Minifigure Components:
This is the primary file you'll want to modify. It contains all the visual elements and animations of the minifigure. You can modify:
- The dimensions and styling of body parts
- Animation transitions and transformations
- Colors and shadows
- Hover effects
- Active state animations

2. **Styling Definitions**: css:src/app/globals.css
Contains custom animations and transitions that affect the minifigure's movements. You can modify:
- Animation keyframes (like the bounce effect)
- Transition properties
- Transform styles

3. **Types Definition**:
typescript:src/types/seating.ts
If you want to add new appearance properties or animation states, you'll need to update the Person interface with:
- New expression types
- Additional outfit properties
- New animation state properties

4. **Sample Data**:
typescript:src/data/sampleData.ts
Contains the default appearance settings for testing. You can modify:
- Default colors
- Pattern types
- Expression types

The key files for visual modifications, in order of importance, are:
1. `MinifigureThreeD.tsx` - Primary component structure and animations
2. `globals.css` - Global animations and transitions
3. `seating.ts` - Type definitions for new properties
4. `sampleData.ts` - Default appearance settings

Remember that `Minifigure.tsx` exists but isn't being used (the app uses `MinifigureThreeD.tsx` instead), so you can ignore that file.
