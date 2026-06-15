import React, { useMemo, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
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

export const FloorViewer: React.FC<FloorViewerProps> = ({
  floor,
  pathNodes,
  activeStepIdx,
  onNodeClick,
}) => {
  const FloorSVG = SVG_MAP[floor];
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  const highlightNodeIds = useMemo(
    () => pathNodes.map((n) => n.id),
    [pathNodes]
  );

  // Nodes on this floor only — for the route overlay
  const floorNodes = useMemo(
    () => pathNodes.filter((n) => n.floor === floor),
    [pathNodes, floor]
  );

  // Reset scale and position when floor changes
  useEffect(() => {
    if (transformRef.current) {
      transformRef.current.resetTransform();
    }
  }, [floor]);

  return (
    <div className="w-full flex items-center justify-center p-3">
      {/* Fixed aspect ratio wrapper so the SVG always gets a real height */}
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white"
        style={{ aspectRatio: '1000 / 660' }}
      >
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={1}
          maxScale={5}
          centerOnInit={true}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Zoom overlay controls */}
              <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-lg select-none animate-fade-in">
                <button
                  onClick={() => zoomIn()}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  +
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  −
                </button>
                <button
                  onClick={() => resetTransform()}
                  className="px-2.5 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>

              <TransformComponent
                wrapperClassName="!w-full !h-full absolute inset-0 cursor-grab active:cursor-grabbing"
                contentClassName="!w-full !h-full"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={floor}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full"
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
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};
