import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RouteStep, FloorId } from '../../types';
import { useNavigationStore } from '../../store/navigationStore';

interface Props {
  steps: RouteStep[];
  currentFloor: FloorId;
}

const stepIcon = (step: RouteStep, isStart: boolean, isEnd: boolean) => {
  if (isStart) return '🏁';
  if (isEnd) return '🎯';
  if (step.isFloorChange) return '🪜';
  if (step.changeType === 'lift') return '🛗';
  if (step.direction?.toLowerCase().includes('washroom')) return '🚻';
  if (step.direction?.toLowerCase().includes('entrance')) return '🚪';
  if (step.direction?.toLowerCase().includes('turn left')) return '↩️';
  if (step.direction?.toLowerCase().includes('turn right')) return '↪️';
  if (step.direction?.toLowerCase().includes('straight')) return '⬆️';
  return '📍';
};

export const DirectionsList: React.FC<Props> = ({ steps, currentFloor }) => {
  const { currentStepIndex, nextStep, prevStep } = useNavigationStore();
  const activeStepRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll the active step into view inside the panel
  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentStepIndex]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Step Navigation Controls (Prev / Next) */}
      <div className="p-4 border-b border-slate-200/50 bg-white flex gap-2 justify-between items-center shadow-sm z-10">
        <button
          onClick={prevStep}
          disabled={currentStepIndex === 0}
          className="flex-1 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all"
        >
          ◀ Back
        </button>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg min-w-[64px] text-center">
          {currentStepIndex + 1} / {steps.length}
        </span>
        <button
          onClick={nextStep}
          disabled={currentStepIndex === steps.length - 1}
          className="flex-1 px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-emerald-600 disabled:opacity-90 rounded-lg transition-all shadow-sm shadow-blue-100"
        >
          {currentStepIndex === steps.length - 1 ? 'Arrived! 🌟' : 'Next Step ▶'}
        </button>
      </div>

      {/* Step Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 px-1">
          Turn-by-turn Directions
        </h3>
        
        {steps.map((step, i) => {
          const isActive = currentStepIndex === i;
          const isStart = i === 0;
          const isEnd = i === steps.length - 1;
          const stepOnSameFloor = step.floor === currentFloor;

          return (
            <motion.div
              key={step.nodeId + '-' + i}
              ref={isActive ? activeStepRef : null}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: stepOnSameFloor ? 1 : 0.45,
                scale: isActive ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
              className={`
                flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-200
                ${isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
                  : 'bg-white border-slate-200/80 text-slate-700'}
                ${step.isFloorChange && !isActive ? 'border-amber-300 bg-amber-50/50' : ''}
              `}
            >
              {/* Icon Container */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg text-lg select-none
                ${isActive ? 'bg-white/20' : 'bg-slate-100'}
              `}>
                {stepIcon(step, isStart, isEnd)}
              </div>

              {/* Instruction Text */}
              <div className="flex-1 min-w-0">
                <p className={`
                  text-sm font-semibold leading-snug
                  ${isActive ? 'text-white' : 'text-slate-800'}
                `}>
                  {step.direction}
                </p>
                
              </div>

              {/* Number indicator */}
              <span className={`
                text-[10px] font-mono font-bold self-start mt-0.5
                ${isActive ? 'text-white/60' : 'text-slate-300'}
              `}>
                {i + 1}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
