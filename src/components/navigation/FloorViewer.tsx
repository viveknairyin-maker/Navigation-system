import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FloorId, NavNode } from '../../types';
import { RouteAnimator } from './RouteAnimator';
import GroundFloorSVG from '../svg/GroundFloorSVG';
import FirstFloorSVG from '../svg/FirstFloorSVG';
import SecondFloorSVG from '../svg/SecondFloorSVG';
import ThirdFloorSVG from '../svg/ThirdFloorSVG';

interface FloorViewerProps {
  floor: FloorId;
  pathNodes: NavNode[];
  activeStepIdx: number;
  onNodeClick?: (id: string) => void;
}

const SVG_MAP: Record<FloorId, React.ComponentType<{ highlightNodeIds: string[]; onNodeClick?: (id: string) => void }>> = {
  ground: GroundFloorSVG,
  first: FirstFloorSVG,
  second: SecondFloorSVG,
  third: ThirdFloorSVG,
};

const FLOOR_TRANSFORMS: Record<FloorId, { transform: string; transformOrigin: string }> = {
  ground: {
    transform: 'translate(0, 5.303%)',
    transformOrigin: '50% 50%',
  },
  first: {
    transform: 'none',
    transformOrigin: '50% 50%',
  },
  second: {
    transform: 'translate(0, 5.303%) scale(-1, 1)',
    transformOrigin: '50% 50%',
  },
  third: {
    transform: 'translate(0, 5.303%)',
    transformOrigin: '50% 50%',
  },
};

export const FloorViewer: React.FC<FloorViewerProps> = ({
  floor,
  pathNodes,
  activeStepIdx,
  onNodeClick,
}) => {
  const FloorSVG = SVG_MAP[floor];
  const highlightNodeIds = useMemo(
    () => pathNodes.map((n) => n.id),
    [pathNodes]
  );

  // Nodes on this floor only — for the route overlay
  const floorNodes = useMemo(
    () => pathNodes.filter((n) => n.floor === floor),
    [pathNodes, floor]
  );

  const currentTransform = FLOOR_TRANSFORMS[floor];

  return (
    <div className="w-full flex items-center justify-center p-3">
      {/* Fixed aspect ratio wrapper so the SVG always gets a real height */}
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white"
        style={{ aspectRatio: '1000 / 660' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={floor}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{
              transform: currentTransform.transform,
              transformOrigin: currentTransform.transformOrigin,
            }}
          >
            {/* Floor plan */}
            <FloorSVG
              highlightNodeIds={highlightNodeIds}
              onNodeClick={onNodeClick}
            />

            {/* Route path overlay — same viewBox as floor SVG */}
            {floorNodes.length > 1 && (
              <svg
                viewBox="0 0 1000 660"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 10 }}
              >
                <RouteAnimator
                  nodes={floorNodes}
                  activeIdx={Math.min(activeStepIdx, floorNodes.length - 1)}
                />
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
