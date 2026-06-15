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
    <div className="w-full flex flex-col items-center justify-center p-3">
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={1}
        maxScale={5}
        centerOnInit={true}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Fixed aspect ratio wrapper so the SVG always gets a real height */}
            <div
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white"
              style={{ aspectRatio: '1000 / 660' }}
            >
              <TransformComponent
                wrapperClass="!w-full !h-full absolute inset-0 cursor-grab active:cursor-grabbing"
                contentClass="!w-full !h-full"
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
            </div>

            {/* Zoom overlay controls - Rendered directly below the blueprint card */}
            <div className="mt-4 flex items-center justify-center gap-2 bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg select-none">
              <span className="text-xs font-bold text-slate-400 mr-2">Zoom:</span>
              <button
                onClick={() => zoomIn()}
                className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-lg flex items-center justify-center transition-all cursor-pointer"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-lg flex items-center justify-center transition-all cursor-pointer"
              >
                −
              </button>
              <button
                onClick={() => resetTransform()}
                className="px-3.5 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
