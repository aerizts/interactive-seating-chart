'use client';

import { motion } from 'framer-motion';
import { SignProps } from '@/types/seating';

/**
 * The `Sign` component renders a 3D flip card effect that displays a name on its front side.
 * When the `isFlipped` prop is set to `true`, the card flips to reveal a plain back side.
 * The component uses the `motion.div` from the `framer-motion` library to animate the flip transition.
 * It includes side edges for a 3D effect and uses CSS gradients for the background colors.
 *
 * @param {string} name - The name to be displayed on the front side of the card.
 * @param {boolean} isFlipped - Controls whether the card is flipped to show the back side.
 */
const Sign = ({ name, isFlipped }: Readonly<SignProps>) => {
  return (
    <motion.div
      className="relative w-[66px] h-[22px]"
      initial={false}
      animate={{
        rotateX: isFlipped ? 180 : 0,
      }}
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }}
      style={{
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
    >
      {/* Front side (facing inward initially) */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-white rounded-sm shadow-sm"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateX(180deg)',
          border: '1px solid rgba(0,0,0,0.1)',
          background: 'linear-gradient(to bottom, #ffffff, #f8fafc)'
        }}
      >
        <div className="px-1.5 w-full">
          <span className="block text-[10px] font-bold text-center truncate text-gray-800">
            {name}
          </span>
        </div>
      </div>

      {/* Back side (facing outward initially) */}
      <div
        className="absolute inset-0 rounded-sm shadow-sm"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          border: '1px solid rgba(0,0,0,0.1)',
          background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)'
        }}
      />

      {/* Side edges for 3D effect */}
      <div
        className="absolute inset-y-0 left-0 w-[1px] bg-gray-200/50"
        style={{ transform: 'translateX(-1px)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[1px] bg-gray-200/50"
        style={{ transform: 'translateX(1px)' }}
      />
    </motion.div>
  );
};

export default Sign;
