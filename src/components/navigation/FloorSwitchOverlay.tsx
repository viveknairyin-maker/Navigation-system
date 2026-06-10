import React from 'react';
import { motion } from 'framer-motion';
import { FloorId } from '../../types';

interface Props {
  targetFloor: FloorId;
  changeType?: 'staircase' | 'lift';
}

const floorLabel = (f: FloorId) => {
  if (f === 'ground') return 'Ground Floor';
  if (f === 'first') return '1st Floor';
  return '2nd Floor';
};

export const FloorSwitchOverlay: React.FC<Props> = ({ targetFloor, changeType = 'staircase' }) => {
  const icon = changeType === 'lift' ? '🛗' : '🪜';
  const actionText = changeType === 'lift' ? 'Taking the Lift' : 'Climbing the Stairs';

  return (
    <motion.div
      key="floor-switch"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-xl"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="text-center text-white px-6"
      >
        <div className="text-7xl mb-4 filter drop-shadow-[0_4px_12px_rgba(59,130,246,0.5)]">
          {icon}
        </div>
        <h3 className="text-2xl font-black mb-2 tracking-tight">
          {actionText}
        </h3>
        <p className="text-blue-200 text-lg">
          Moving to <span className="font-semibold text-white">{floorLabel(targetFloor)}</span>
        </p>

        {/* Loading Progress Bar */}
        <div className="mt-6 h-2 w-56 bg-slate-800/80 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
